import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail } from "lucide-react";
import clsx from "clsx";
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
  });
}

function NewslettersPage() {
  return (
    <div className="flex-1">
      <div className="fixed top-0 w-full h-full bg-bg-blue" />
      <div
        className={clsx(
          "bg-bg border-border border-t",
          "mt-[20rem] z-10 relative flex flex-col items-center justify-center gap-16 pb-[4rem] px-4",
        )}
      >
        <div className="dots-header absolute top-1 w-full z-0 h-[8rem] bg-repeat-x opacity-60" />

        <div className="flex z-10 flex-col items-center gap-8 justify-center max-w-[40rem] bg-background border-inherit border-[1px] p-8 -mt-[10rem] rounded-md">
          <h1 className="text-accent-red text-center font-mono font-semibold text-5xl md:text-6xl whitespace-nowrap">
            NEWSLETTERS
          </h1>
          <div className="text-foreground/80 text-center">
            <p className="font-medium">Missed a previous issue? Read them below. Want to get new ones in your inbox?</p>
          </div>
          <div className="flex flex-row items-center justify-center">
            <Button variant="outline" asChild>
              <a
                href={SIGNUP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex flex-row items-center gap-2 group"
              >
                <Mail className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform duration-300" />
                <span>Sign up</span>
              </a>
            </Button>
          </div>
        </div>

        <div className="z-10 w-full max-w-3xl">
          {newsletters.length === 0 ? (
            <div className="flex flex-col items-center gap-2 text-foreground/70 py-8 text-center">
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
      </div>
    </div>
  );
}
