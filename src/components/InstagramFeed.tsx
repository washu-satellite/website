import { useEffect, useRef } from "react";
import { PiInstagramLogoFill } from "react-icons/pi";
import { Button } from "./ui/button";
import { INSTAGRAM_POSTS } from "@/const/content/instagram";

// Loads Instagram's embed.js exactly once (across mounts/HMR) and resolves
// when window.instgrm is available. Subsequent callers reuse the same promise.
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

const SCRIPT_SRC = "https://www.instagram.com/embed.js";
let embedJsPromise: Promise<void> | null = null;

function ensureEmbedJs(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.instgrm) return Promise.resolve();
  if (embedJsPromise) return embedJsPromise;

  embedJsPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Instagram embed.js failed to load")),
      );
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Instagram embed.js failed to load"));
    document.body.appendChild(s);
  });

  return embedJsPromise;
}

function InstagramPost({ url }: { url: string }) {
  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{
        background: "#fff",
        border: 0,
        borderRadius: 3,
        boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
        margin: 0,
        maxWidth: 540,
        minWidth: 326,
        padding: 0,
        width: "100%",
      }}
    />
  );
}

export default function InstagramFeed(props: {
  /** Override the default URL list for one-off uses. */
  posts?: string[];
  /** Where the "View all" button goes. */
  profileUrl?: string;
}) {
  const posts = props.posts ?? INSTAGRAM_POSTS;
  const profileUrl =
    props.profileUrl ?? "https://www.instagram.com/washusatellite/";
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (posts.length === 0) return;
    let cancelled = false;
    ensureEmbedJs()
      .then(() => {
        if (cancelled) return;
        // process() walks the DOM and replaces .instagram-media blockquotes
        // with the live iframes. Safe to call repeatedly.
        window.instgrm?.Embeds.process();
      })
      .catch((err) => {
        console.error("instagram embed load failed", err);
      });
    return () => {
      cancelled = true;
    };
  }, [posts]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center gap-2 justify-between">
        <h3 className="font-mono uppercase text-xs tracking-wider text-foreground/60">
          From the gram
        </h3>
        <Button asChild variant="outline" size="sm">
          <a href={profileUrl} target="_blank" rel="noreferrer">
            <PiInstagramLogoFill className="w-4 h-4 mr-2" />
            Follow @washusatellite
          </a>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="border border-dashed border-border rounded-md p-6 text-sm text-foreground/60 text-center">
          No posts wired up yet. Add post URLs to{" "}
          <code className="font-mono text-xs">src/const/content/instagram.ts</code>.
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex flex-row gap-4 overflow-x-auto snap-x snap-mandatory scrollbar pb-2"
          style={{ justifyContent: "safe center" }}
        >
          {/* Instagram's embed is a cross-origin iframe from instagram.com, so
              its interior cannot be themed and it has no dark-mode parameter.
              The white panel is unavoidable; framing it in a themed card makes
              it read as a deliberate photo mount instead of a glare box. */}
          {posts.map((url) => (
            <div
              key={url}
              className="snap-start shrink-0 w-[20rem] md:w-[24rem] rounded-lg border border-border bg-background p-2 shadow-sm dark:bg-bg dark:shadow-none"
            >
              <InstagramPost url={url} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
