import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, House } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { newsletters } from "@/const/content/newsletters";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/newsletters/$slug")({
  component: NewsletterView,
});

function NewsletterView() {
  const { slug } = Route.useParams();
  const nl = newsletters.find((n) => n.slug === slug);

  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nl) return;
    fetch(nl.file)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then(setHtml)
      .catch((e) => setError(String(e)));
  }, [nl]);

  if (!nl) {
    return (
      <div className="h-screen flex flex-col justify-center items-center text-center gap-4">
        <h1 className="text-lg">
          No newsletter with id{" "}
          <Badge
            variant="outline"
            className="font-mono text-base font-semibold rounded-md"
          >
            {slug}
          </Badge>
        </h1>
        <Button asChild variant="outline">
          <Link to="/newsletters" className="flex flex-row items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            All newsletters
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-[5rem] pb-[4rem] px-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-3">
        <Button asChild variant="ghost" className="self-start">
          <Link to="/newsletters" className="flex flex-row items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            All newsletters
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">{nl.title}</h1>
        {error ? (
          <div className="flex flex-col items-center gap-2 text-foreground/70 py-16 text-center">
            <House className="w-8 h-8" />
            <p>Couldn't load this newsletter ({error}).</p>
          </div>
        ) : html === null ? (
          <p className="text-foreground/60 py-16 text-center">Loading…</p>
        ) : (
          <div
            className="newsletter-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}
