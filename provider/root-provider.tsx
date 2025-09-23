'use client';

import { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/layout';
import { useCampaignsDataStore } from '@/stores/campaignStore';
import { ScreenLoader } from '@/components/screen-loader';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent sidebar flash by showing loader initially
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ScreenLoader title='Loading contents' />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <CampaignInitializer />
      <Layout>{children}</Layout>
    </QueryClientProvider>
  );
}
