'use client';

import { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/layout';
import { useCampaignsDataStore } from '@/stores/campaignStore';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 1000 * 60 * 5, // 5 minutes
      // gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
      retry: 1,
    },
  },
});

function CampaignInitializer() {
  useEffect(() => {
    // Initialize campaigns data store on app start
    useCampaignsDataStore.getState().initializeCampaigns();
  }, []);

  return null;
}

export default function RootProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CampaignInitializer />
      <Layout>{children}</Layout>
    </QueryClientProvider>
  );
}
