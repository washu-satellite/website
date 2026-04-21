import { createFileRoute, Link } from "@tanstack/react-router";
import GenericPage from "@/components/GenericPage";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail } from "lucide-react";
import { newsletters } from "@/const/content/newsletters";

const SIGNUP_URL = "https://signup.e2ma.net/signup/2009107/1979383/";

export const Route = createFileRoute("/newsletters/")({
  component: NewslettersPage,
});

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function NewslettersPage() {
  return (
    <GenericPage
      title="Newsletters"
      headerContent={
        <div className="flex flex-col gap-4">
          <p>Past updates from WashU Satellite</p>
          <div className="flex flex-row flex-wrap items-center gap-3">
            <Button asChild>
              <a href={SIGNUP_URL} target="_blank" rel="noreferrer">
                <Mail className="w-4 h-4 mr-2" />
                Sign up for the newsletter
              </a>
            </Button>
            <span className="text-xs text-foreground/60">
              Get new issues in your inbox.
            </span>
          </div>
        </div>
      }
    >
      <div className="px-[4rem] py-8">
        {newsletters.length === 0 ? (
          <div className="flex flex-col items-center gap-2 text-foreground/70 py-16 text-center">
            <Mail className="w-10 h-10" />
            <p>No newsletters yet — check back soon.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {newsletters.map((n) => (
              <li
                key={n.slug}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border border-border rounded-md p-4 bg-background"
              >
                <div className="flex flex-col gap-1">
                  <Link
                    to="/newsletters/$slug"
                    params={{ slug: n.slug }}
                    className="font-medium hover:underline underline-offset-2"
                  >
                    {n.title}
                  </Link>
                  <p className="text-sm text-foreground/70 font-mono">
                    {formatDate(n.date)}
                  </p>
                  {n.summary && (
                    <p className="text-sm text-foreground/80">{n.summary}</p>
                  )}
                </div>
                <Button asChild variant="outline">
                  <Link to="/newsletters/$slug" params={{ slug: n.slug }}>
                    Read
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </GenericPage>
  );
}
