import newslettersJson from "./newsletters.json";

/**
 * To add a newsletter:
 *   1. Drop the HTML file into `public/newsletters/<slug>.html`
 *   2. Add an entry here pointing `file` at `/newsletters/<slug>.html`
 *
 * Newest first — the listing page preserves array order.
 */
export type Newsletter = {
  slug: string;
  title: string;
  date: string; // ISO-8601, e.g. "2026-04-21"
  summary?: string;
  file: string; // URL path to the HTML file under public/
};

export const newsletters: Newsletter[] = newslettersJson;
