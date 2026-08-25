import { HeadContent, Scripts, createRootRouteWithContext, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'


import appCss from '../styles.css?url'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import RecruitmentPopup from '@/components/RecruitmentPopup'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { bStore } from '@/hooks/useAppStore'
import { cn } from '@/lib/utils'
import { queryClient } from '@/queryClient'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'WashU Satellite',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

/**
 * Routes that render their own full-viewport experience and must not sit inside the site chrome.
 * The ticket page pins a canvas to the viewport and drives its own scroll, so a nav bar over it and
 * a footer below it would both overlay the scene and add height to a page whose length is the
 * animation timeline.
 */
const CHROMELESS = new Set(['/9njdxq3e'])

/**
 * Pages that carry their own primary call to action. The recruitment popup would open on top of it
 * and ask for a different click, so these opt out of it while keeping the rest of the chrome.
 */
const NO_POPUP = new Set(['/space'])

function RootDocument({ children }: { children: React.ReactNode }) {
  const _theme = bStore.use.theme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const path = pathname.replace(/\/+$/, '') || '/';
  const bare = CHROMELESS.has(path);

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body
          suppressHydrationWarning
          className={cn(
            "bg-deep-background",
            !bare && "flex flex-col min-h-screen",
            {
              "dark": _theme !== "light"
            }
          )}
        >
          {!bare && <NavBar />}
          {children}
          {!bare && <Footer />}
          {!bare && !NO_POPUP.has(path) && <RecruitmentPopup />}
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </body>
      </html>
    </QueryClientProvider>
  )
}
