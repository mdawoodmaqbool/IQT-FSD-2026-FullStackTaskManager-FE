"use client";

import { ApolloProvider } from "@/providers/ApolloProvider";
import { AuthProvider } from "@/context/AuthContext";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ApolloProvider>
      <AuthProvider>{children}</AuthProvider>
    </ApolloProvider>
  );
}
