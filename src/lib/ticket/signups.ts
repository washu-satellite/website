import { list, put } from "@vercel/blob";
import type { SignupEntry } from "./signupSchema";

export interface SignupStore {
  append(entry: SignupEntry): Promise<void>;
  list(): Promise<SignupEntry[]>;
}

/**
 * Blob-backed, because this runs on Vercel now. The original store appended to a local JSONL file,
 * which works locally and silently loses every claimed name in production: the serverless filesystem
 * is read-only outside /tmp, and /tmp itself is per-invocation.
 *
 * One blob per signup rather than one appended log. Blob has no append, so a shared log would mean
 * read-modify-write on every claim, and two people claiming at once would drop one of them. Separate
 * keys make that race impossible; `list()` reassembles them in timestamp order.
 */
const PREFIX = "ticket-signups/";

/** Keeps keys sortable by time and unique per claim. */
function keyFor(entry: SignupEntry): string {
  const stamp = entry.timestamp.replace(/[:.]/g, "-");
  const suffix = Math.random().toString(36).slice(2, 10);
  return `${PREFIX}${stamp}-${suffix}.json`;
}

export class BlobSignupStore implements SignupStore {
  async append(entry: SignupEntry): Promise<void> {
    const key = keyFor(entry);
    console.log("signups: writing blob", { key, name: entry.name });

    try {
      await put(key, JSON.stringify(entry), {
        access: "public",
        contentType: "application/json",
        // The key already carries a timestamp and a random suffix; letting Blob add its own would
        // make the object impossible to find again by prefix listing.
        addRandomSuffix: false,
      });
    } catch (err) {
      throw new Error(
        `Could not store the signup for "${entry.name}" at ${key}`,
        { cause: err },
      );
    }
  }

  async list(): Promise<SignupEntry[]> {
    let blobs;
    try {
      ({ blobs } = await list({ prefix: PREFIX }));
    } catch (err) {
      throw new Error(`Could not list signups under ${PREFIX}`, { cause: err });
    }

    const entries = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const res = await fetch(blob.url);
          if (!res.ok) {
            throw new Error(`status ${res.status}`);
          }
          return (await res.json()) as SignupEntry;
        } catch (err) {
          // One unreadable blob should not hide every other signup.
          console.error("signups: could not read blob", {
            key: blob.pathname,
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
    console.log("signups: no BLOB_READ_WRITE_TOKEN, keeping in memory", {
      name: entry.name,
    });
    this.entries.push(entry);
  }

  async list(): Promise<SignupEntry[]> {
    return [...this.entries];
  }
}

let store: SignupStore | null = null;

export function getSignupStore(): SignupStore {
  if (!store) {
    store = process.env.BLOB_READ_WRITE_TOKEN
      ? new BlobSignupStore()
      : new MemorySignupStore();
    console.log("signups: store selected", {
      kind: store.constructor.name,
    });
  }
  return store;
}
