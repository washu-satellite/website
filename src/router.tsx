import { createRouter } from '@tanstack/react-router';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { queryClient } from './queryClient';

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    context: {
      queryClient
    },

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
}