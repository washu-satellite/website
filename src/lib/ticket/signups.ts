import type { SignupEntry } from "./signupSchema";

/**
 * Blob is spoken to over its REST API rather than through @vercel/blob.
 *
 * The SDK resolves credentials through a helper that was bundled from CommonJS into ESM, so it
 * calls require() and throws the moment you read or write. Passing a token explicitly does not
 * avoid it and neither does marking the package external, so every signup failed in production.
 * These three requests are the whole of what we need and they depend on nothing but fetch.
 */
export interface SignupStore {
  append(entry: SignupEntry): Promise<void>;
  list(): Promise<SignupEntry[]>;
}

/**
 * One blob per signup rather than one appended log. Blob has no append, so a shared log would mean
 * read-modify-write on every claim and two people claiming at once would drop one of them. Separate
 * keys make that race impossible; list() reassembles them in timestamp order.
 *
 * The store is private. These entries carry a person's name and their email, and a public blob is
 * readable by anyone holding the URL -- unguessable is not the same as protected.
 */
const PREFIX = "ticket-signups/";

/** Keeps keys sortable by time and unique per claim. */
function keyFor(entry: SignupEntry): string {
  const stamp = entry.timestamp.replace(/[:.]/g, "-");
  const suffix = Math.random().toString(36).slice(2, 10);
  return `${PREFIX}${stamp}-${suffix}.json`;
}

const BLOB_API = "https://vercel.com/api/blob";

/** Matches the version @vercel/blob itself sends. The API rejects requests that omit it. */
const API_VERSION = "12";

type BlobListItem = { pathname: string; url: string; downloadUrl?: string };

function requireToken(operation: string): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      `${operation} needs BLOB_READ_WRITE_TOKEN, which is not set on this deployment`,
    );
  }
  return token;
}

function authHeaders(token: string): Record<string, string> {
  return {
    authorization: `Bearer ${token}`,
    "x-api-version": API_VERSION,
  };
}

/** Blob's errors are JSON bodies, so the status alone never says what went wrong. */
async function failure(operation: string, response: Response): Promise<Error> {
  const body = await response.text().catch(() => "");
  return new Error(
    `${operation} failed: ${response.status} ${response.statusText} ${body.slice(0, 300)}`,
  );
}

export class BlobSignupStore implements SignupStore {
  async append(entry: SignupEntry): Promise<void> {
    const key = keyFor(entry);
    const token = requireToken("Storing a signup");
    console.log("signups: writing blob", { key, name: entry.name });

    let response: Response;
    try {
      response = await fetch(`${BLOB_API}/${key}`, {
        method: "PUT",
        headers: {
          ...authHeaders(token),
          "x-content-type": "application/json",
          // Required: the store is private, and an upload that does not say so is rejected as an
          // attempt to make a public blob in it.
          "x-vercel-blob-access": "private",
          // The key already carries a timestamp and a random suffix; a second one from Blob would
          // only make the object harder to find again.
          "x-add-random-suffix": "0",
        },
        body: JSON.stringify(entry),
      });
    } catch (err) {
      throw new Error(`Could not reach Blob to store "${entry.name}" at ${key}`, {
        cause: err,
      });
    }

    if (!response.ok) {
      throw await failure(`Storing the signup for "${entry.name}" at ${key}`, response);
    }
  }

  async list(): Promise<SignupEntry[]> {
    const token = requireToken("Listing signups");
    const items: BlobListItem[] = [];
    let cursor: string | undefined;

    // Paginated, because a successful campaign is exactly the case where one page is not enough.
    do {
      const url = new URL(`${BLOB_API}/`);
      url.searchParams.set("prefix", PREFIX);
      url.searchParams.set("limit", "1000");
      if (cursor) url.searchParams.set("cursor", cursor);

      const response = await fetch(url, { headers: authHeaders(token) });
      if (!response.ok) {
        throw await failure(`Listing signups under ${PREFIX}`, response);
      }

      const page = (await response.json()) as {
        blobs?: BlobListItem[];
        cursor?: string;
        hasMore?: boolean;
      };
      items.push(...(page.blobs ?? []));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);

    const entries = await Promise.all(
      items.map(async (item) => {
        try {
          // Private blobs need the token on the download too, not just on the listing.
          const response = await fetch(item.downloadUrl ?? item.url, {
            headers: authHeaders(token),
          });
          if (!response.ok) throw await failure(`Reading ${item.pathname}`, response);
          return JSON.parse(await response.text()) as SignupEntry;
        } catch (err) {
          // One unreadable blob should not hide every other signup.
          console.error("signups: could not read blob", {
            key: item.pathname,
            err,
          });
          return null;
        }
      }),
    );

    return entries
      .filter((e): e is SignupEntry => e !== null)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }
}

/**
 * In-memory fallback for local development, where there is no Blob token. Deliberately not a file
 * store: the whole point of the seam is that production and local disagree about persistence, and a
 * store that quietly works locally but not deployed is how the original one hid its own failure.
 */
export class MemorySignupStore implements SignupStore {
  private readonly entries: SignupEntry[] = [];

  async append(entry: SignupEntry): Promise<void> {
    console.log("signups: no Blob store configured, keeping in memory", {
      name: entry.name,
    });
    this.entries.push(entry);
  }

  async list(): Promise<SignupEntry[]> {
    return [...this.entries];
  }
}

/**
 * True when we are running on Vercel with nowhere durable to write.
 *
 * The memory store is the right answer locally, where there is no Blob token and nobody expects a
 * signup to survive a restart. In production it is the worst possible answer: serverless memory dies
 * with the invocation, so every claim would return 201 and then be gone, and nothing would say so
 * until someone went looking for the list and found it empty. Callers use this to refuse instead.
 */
export function storageUnavailable(): boolean {
  return Boolean(process.env.VERCEL) && !blobIsConfigured();
}

/**
 * Blob can be reached two ways and only one of them sets a token.
 *
 * A store connected the classic way exports BLOB_READ_WRITE_TOKEN. A store connected through the
 * OIDC integration exports BLOB_STORE_ID instead and the SDK exchanges credentials at runtime, so
 * keying off the token alone reports "no storage" on a project that has perfectly good storage --
 * which is how signups ended up in the memory fallback in production.
 */
function blobIsConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID,
  );
}

let store: SignupStore | null = null;

export function getSignupStore(): SignupStore {
  if (!store) {
    store = blobIsConfigured() ? new BlobSignupStore() : new MemorySignupStore();
    console.log("signups: store selected", {
      kind: store.constructor.name,
    });
  }
  return store;
}
