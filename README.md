This is the codebase for WashU Satellite's official website, available at [washusatellite.com](https://www.washusatellite.com) and [wusat.org](https://www.wusat.org).

To build and run the site locally in development mode, use
```
yarn dev
```

## Project Overview

### Technologies

- The site's software stack is centrally supported by TanStack libraries, including Query, Start, Form, Router, and more

- ShadCN & TailwindCSS for UI elements (stored in `/src/components/ui`)

- Drizzle for database operations and schema management

- Zod for object control and verbose forms

- BetterAuth for authentication control, with an admin extension for in-site user management

- Zustand for globalized and persistent state management


### Project Structure

- `/src/components`: All UI components used by the site. `/src/components/ui` are imported ShadCN boilerplates.
- `/src/const`: Constants, usually text content on the homepage
- `/src/hooks`: React hooks, primarily Zustand's `bStore`
- `/src/lib`: Miscellaneous libraries, including authentication and database schemas/utilities
- `/src/routes`: TanStack Start pages used by the site
- `/src/services`: Server functions, TanStack Query queries, and Zod schemas
- `/src/types`: TypeScript type definitions that need to be centralized [generally it is best to write types within their most directly-applicable file]
- `/src/util`: Miscellaneous utility functions

## Usage

### Deployment

Production buils are currently deployed to Vercel. This is done under a personal account, [github.com/nathanielhayman/ws-website](https://github.com/nathanielhayman/ws-website/tree/master), but can be later migrated to a commerical Vercel instance.

If your changes are not appearing on the production site, please contact the CSW (Samir Afsary).
