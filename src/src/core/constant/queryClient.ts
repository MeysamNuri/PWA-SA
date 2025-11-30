// src/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes

            // How long inactive queries remain in the cache.
            // After this time, they are garbage collected.
            gcTime: 1000 * 60 * 60, // 1 hour

            // Refetch queries on window focus.
            refetchOnWindowFocus: true,

            // Refetch queries on network reconnect.
            refetchOnReconnect: true,

            // Refetch queries on mount.
            refetchOnMount: true,

            // Retry failed queries.
            retry: 3,

            // Delay between retries.
            retryDelay: (attemptIndex) =>
                Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
            // You can define default options for mutations here as well
        },
    },
});

export default queryClient;
