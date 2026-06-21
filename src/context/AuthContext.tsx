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
import { GET_ME, LOGIN, RESET_PASSWORD, SIGNUP } from "@/graphql/auth-operations";
import {
  clearAuth,
  getStoredUser,
  getToken,
  saveAuth,
} from "@/lib/auth-storage";
import type { MessageResponse, User } from "@/types/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, countryCode: string) => Promise<void>;
  resetPassword: (email: string, password: string) => Promise<MessageResponse>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

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
  });

  const user = liveUser ?? data?.me ?? cachedUser;
  const isAuthenticated = Boolean(authReady && hasToken && user && !meError);
  const loading =
    !authReady || (hasToken && meLoading && !data?.me && !meError && !cachedUser && !liveUser);

  const [loginMutation] = useMutation(LOGIN);
  const [signupMutation] = useMutation(SIGNUP);
  const [resetPasswordMutation] = useMutation(RESET_PASSWORD);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data: loginData } = await loginMutation({
        variables: { email, password },
      });

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

      saveAuth(signupData.signup.token, signupData.signup.user);
      setLiveUser(signupData.signup.user);
      setCachedUser(signupData.signup.user);
      setHasToken(true);
    },
    [signupMutation],
  );

  const resetPassword = useCallback(
    async (email: string, password: string) => {
      const { data: resetData } = await resetPasswordMutation({
        variables: { email, password },
      });

      return resetData.resetPassword as MessageResponse;
    },
    [resetPasswordMutation],
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
      resetPassword,
      logout,
    }),
    [isAuthenticated, loading, login, logout, resetPassword, signup, user],
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
