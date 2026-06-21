"use client";

import { ApolloProvider } from "@/providers/ApolloProvider";
import { AuthProvider } from "@/context/AuthContext";
import { SnackbarProvider } from "@/context/SnackbarContext";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ApolloProvider>
      <AuthProvider>
        <SnackbarProvider>{children}</SnackbarProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
