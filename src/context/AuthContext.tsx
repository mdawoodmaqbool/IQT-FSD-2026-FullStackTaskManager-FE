"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { GET_ME, LOGIN, SIGNUP } from "@/graphql/auth-operations";
import {
  clearAuth,
  getStoredUser,
  getToken,
  saveAuth,
} from "@/lib/auth-storage";
import type { User } from "@/types/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, countryCode: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isUnauthenticatedError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("graphQLErrors" in error)) {
    return false;
  }

  const graphQLErrors = (error as { graphQLErrors?: Array<{ extensions?: { code?: string; status?: number } }> })
    .graphQLErrors;

  return Boolean(
    graphQLErrors?.some(
      (graphQLError) =>
        graphQLError.extensions?.code === "UNAUTHENTICATED" ||
        graphQLError.extensions?.status === 401,
    ),
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const client = useApolloClient();
  const [authReady, setAuthReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [cachedUser, setCachedUser] = useState<User | null>(null);
  const [liveUser, setLiveUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getToken();
    setHasToken(Boolean(token));
    setCachedUser(token ? getStoredUser<User>() : null);
    setAuthReady(true);
  }, []);

  const { data, loading: meLoading, error: meError } = useQuery(GET_ME, {
    skip: !authReady || !hasToken,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  useEffect(() => {
    if (!authReady || !hasToken || meLoading) {
      return;
    }

    if (!isUnauthenticatedError(meError)) {
      return;
    }

    clearAuth();
    setLiveUser(null);
    setCachedUser(null);
    setHasToken(false);
    void client.clearStore();
  }, [authReady, client, hasToken, meError, meLoading]);

  const user = liveUser ?? data?.me ?? cachedUser;
  const isAuthenticated = Boolean(authReady && hasToken && user);
  const loading = !authReady || (hasToken && !user && meLoading);

  const [loginMutation] = useMutation(LOGIN);
  const [signupMutation] = useMutation(SIGNUP);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data: loginData } = await loginMutation({
        variables: { email, password },
      });

      if (!loginData?.login) {
        throw new Error("Login failed. Please try again.");
      }

      saveAuth(loginData.login.token, loginData.login.user);
      setLiveUser(loginData.login.user);
      setCachedUser(loginData.login.user);
      setHasToken(true);
    },
    [loginMutation],
  );

  const signup = useCallback(
    async (email: string, password: string, countryCode: string) => {
      const { data: signupData } = await signupMutation({
        variables: { email, password, countryCode },
      });

      if (!signupData?.signup) {
        throw new Error("Signup failed. Please try again.");
      }

      saveAuth(signupData.signup.token, signupData.signup.user);
      setLiveUser(signupData.signup.user);
      setCachedUser(signupData.signup.user);
      setHasToken(true);
    },
    [signupMutation],
  );

  const logout = useCallback(async () => {
    clearAuth();
    setLiveUser(null);
    setCachedUser(null);
    setHasToken(false);
    await client.clearStore();
  }, [client]);

  const value = useMemo(
    () => ({
      user: isAuthenticated ? user : null,
      loading,
      isAuthenticated,
      login,
      signup,
      logout,
    }),
    [isAuthenticated, loading, login, logout, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
