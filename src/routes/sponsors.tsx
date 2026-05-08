import { createFileRoute } from "@tanstack/react-router";
import GenericPage from "@/components/GenericPage";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { sponsors, SPONSOR_TIERS, type Sponsor } from "@/const/content/sponsors";

export const Route = createFileRoute("/sponsors")({
  component: SponsorsPage,
});

function SponsorTile({ s }: { s: Sponsor }) {
  const Inner = (
    <div className="flex flex-col gap-2 p-4 border border-border rounded-md bg-background hover:border-primary/60 transition-colors h-full">
      {s.logo && (
        <img
          src={s.logo}
          alt={s.name}
          className="h-16 w-auto object-contain self-start"
          loading="lazy"
        />
      )}
      <h3 className="font-sans font-medium">{s.name}</h3>
      {s.blurb && <p className="text-sm text-foreground/80">{s.blurb}</p>}
    </div>
  );

  return s.href ? (
    <a
      href={s.href}
      target="_blank"
      rel="noreferrer"
      className="block w-full md:w-[20rem]"
    >
      {Inner}
    </a>
  ) : (
    <div className="block w-full md:w-[20rem]">{Inner}</div>
  );
}

function SponsorsPage() {
  const grouped = SPONSOR_TIERS.map((tier) => ({
    tier,
    items: sponsors.filter((s) => s.tier === tier),
  })).filter((g) => g.items.length > 0);

  return (
    <GenericPage
      title="Sponsors"
      headerContent={
        <div className="flex flex-col items-center gap-4 text-center">
          <p>
            We&rsquo;re grateful to the partners and programs that make our
            missions possible.
          </p>
          <Button asChild variant="outline">
            <a href="mailto:washusatellite@gmail.com?subject=Sponsorship%20inquiry">
              <Mail className="w-4 h-4 mr-2" />
              Become a sponsor
            </a>
          </Button>
        </div>
      }
    >
      <div className="px-[4rem] py-8 flex flex-col gap-10">
        {grouped.map((g) => (
          <div key={g.tier} className="flex flex-col gap-3">
            <h2 className="font-mono uppercase text-xs tracking-wider text-foreground/60">
              {g.tier} sponsors
            </h2>
            <div className="flex flex-row flex-wrap gap-4">
              {g.items.map((s) => (
                <SponsorTile key={s.name} s={s} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </GenericPage>
  );
}
