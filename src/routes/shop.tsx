import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import GenericPage from "@/components/GenericPage";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
});

const SHOP_NAME = "washu-satellite";
const SHOP_URL = `https://${SHOP_NAME}.myspreadshop.com`;
const SCRIPT_SRC = `${SHOP_URL}/shopfiles/shopclient/shopclient.nocache.js`;

declare global {
  interface Window {
    spread_shop_config?: Record<string, string>;
  }
}

// Spreadshop ships a GWT client that expects its config on `window` before the
// script parses, and it writes into #myShop imperatively. That means it can
// only run after hydration, and the script has to be torn down on unmount or a
// second visit to this route stacks another shop into the container.
function SpreadShop({ onError }: { onError: () => void }) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.spread_shop_config = {
      shopName: SHOP_NAME,
      locale: "us_US",
      prefix: SHOP_URL,
      baseId: "myShop",
    };

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.addEventListener("error", () => {
      console.error("spreadshop client failed to load", { src: SCRIPT_SRC });
      onError();
    });
    document.body.appendChild(script);

    const container = mount.current;
    return () => {
      script.remove();
      delete window.spread_shop_config;
      if (container) container.innerHTML = "";
    };
  }, [onError]);

  return <div id="myShop" ref={mount} />;
}

function ShopPage() {
  const [failed, setFailed] = useState(false);
  // Ad/tracker blockers routinely block the Spreadshop domain, so the direct
  // link has to survive the embed failing.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <GenericPage
      title="Shop"
      headerContent={
        <p className="text-center">
          Team apparel and gear, printed and shipped by Spreadshop. Every order
          supports WashU Satellite.
        </p>
      }
    >
      <div className="mx-auto w-full max-w-[70rem] px-4">
        {mounted && !failed && <SpreadShop onError={() => setFailed(true)} />}

        {(!mounted || failed) && (
          <p className="text-center text-foreground/70">
            {failed ? "The store didn't load — " : "Loading the store… "}
            <a
              className="text-accent-red underline"
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              open it directly at {SHOP_NAME}.myspreadshop.com
            </a>
          </p>
        )}
      </div>
    </GenericPage>
  );
}
