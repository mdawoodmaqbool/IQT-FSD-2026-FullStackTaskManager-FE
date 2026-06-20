"use client";

import { ApolloProvider } from "@/providers/ApolloProvider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <ApolloProvider>{children}</ApolloProvider>;
}
