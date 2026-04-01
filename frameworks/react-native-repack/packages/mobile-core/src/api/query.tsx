import React, {PropsWithChildren} from 'react';

import {QueryClientProvider, useQueryClient} from '@tanstack/react-query';

type Props = {
  client: ReturnType<typeof useQueryClient>;
};

/**
 * Quick helper to make react-query work in standalone mode of the application
 */
function useStandaloneQueryClient(
  fallbackClient: ReturnType<typeof useQueryClient>,
) {
  try {
    return useQueryClient();
  } catch (_error) {
    return fallbackClient;
  }
}

export function QueryProvider({children, client}: PropsWithChildren<Props>) {
  const queryClient = useStandaloneQueryClient(client);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
