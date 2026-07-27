import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  plugins: [
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    // All page content is static (team/project/newsletter data), so prerender
    // every reachable route at build time instead of SSR-ing it per request.
    // Project pages aren't linked from anywhere crawlLinks can reach (the
    // homepage's project link is commented out), so seed them explicitly.
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        // Project pages link out to static poster PDFs; crawlLinks follows
        // every <a href>, so exclude non-route asset files from the crawl.
        filter: (page) => !/\.[a-z0-9]+$/i.test(page.path),
      },
      pages: [
        { path: "/" },
        ...["gs1", "airis", "scalar", "vector", "spinor", "sb1"].map((slug) => ({
          path: `/projects/${slug}`,
        })),
      ],
    }),
    viteReact(),
  ],
})

export default config
