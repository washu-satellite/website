import { HeadContent, Scripts, createRootRouteWithContext, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'


import appCss from '../styles.css?url'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { bStore } from '@/hooks/useAppStore'
import { cn } from '@/lib/utils'
import { authQueries } from '@/services/queries'
import { queryClient } from '@/queryClient'
import { useEffect } from 'react'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  beforeLoad: async ({ context }) => {
    console.log("root beforeLoad triggered");

    const userSession = await context.queryClient.fetchQuery(
      authQueries.user()
    );

    return { userSession };
  },

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

function RootDocument({ children }: { children: React.ReactNode }) {
  // const location = useLocation();

  // const dashboardActive = ["/dashboard"].some(r => location.pathname.startsWith(r))

  const _theme = bStore.use.theme();

  console.log("root rerender");

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body
          suppressHydrationWarning
          className={cn(
            "bg-deep-background flex flex-col min-h-screen",
            {
              "dark": _theme !== "light"
            }
          )}
        >
          {/* <Header /> */}
          <NavBar />
          {children}
          <Footer />
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
