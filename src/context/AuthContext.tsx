"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  FORGOT_PASSWORD,
  GET_ME,
  LOGIN,
  RESEND_OTP,
  RESET_PASSWORD,
  SIGNUP,
  VERIFY_OTP,
} from "@/graphql/auth-operations";
import {
  clearAuth,
  getStoredUser,
  getToken,
  saveAuth,
} from "@/lib/auth-storage";
import type { MessageResponse, OtpType, User } from "@/types/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, countryCode: string) => Promise<MessageResponse>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  resendOtp: (email: string, type?: OtpType) => Promise<MessageResponse>;
  forgotPassword: (email: string) => Promise<MessageResponse>;
  resetPassword: (
    email: string,
    code: string,
    password: string,
  ) => Promise<MessageResponse>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readInitialAuth() {
  if (typeof window === "undefined") {
    return { hasToken: false, user: null as User | null };
  }

  const token = getToken();
  return {
    hasToken: Boolean(token),
    user: token ? getStoredUser<User>() : null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialAuth = useMemo(() => readInitialAuth(), []);
  const [liveUser, setLiveUser] = useState<User | null>(null);
  const [liveToken, setLiveToken] = useState(false);

  const tokenActive = liveToken || initialAuth.hasToken;

  const { data, loading: meLoading, error: meError } = useQuery(GET_ME, {
    skip: !tokenActive,
  });

  const user = liveUser ?? data?.me ?? initialAuth.user;
  const isAuthenticated = Boolean(user && tokenActive && !meError);
  const loading = tokenActive && meLoading && !data && !meError;

  const [loginMutation] = useMutation(LOGIN);
  const [signupMutation] = useMutation(SIGNUP);
  const [verifyOtpMutation] = useMutation(VERIFY_OTP);
  const [resendOtpMutation] = useMutation(RESEND_OTP);
  const [forgotPasswordMutation] = useMutation(FORGOT_PASSWORD);
  const [resetPasswordMutation] = useMutation(RESET_PASSWORD);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data: loginData } = await loginMutation({
        variables: { email, password },
      });

      saveAuth(loginData.login.token, loginData.login.user);
      setLiveUser(loginData.login.user);
      setLiveToken(true);
    },
    [loginMutation],
  );

  const signup = useCallback(
    async (email: string, password: string, countryCode: string) => {
      const { data: signupData } = await signupMutation({
        variables: { email, password, countryCode },
      });

      return signupData.signup as MessageResponse;
    },
    [signupMutation],
  );

  const verifyOtp = useCallback(
    async (email: string, code: string) => {
      const { data: verifyData } = await verifyOtpMutation({
        variables: { email, code },
      });

      saveAuth(verifyData.verifyOtp.token, verifyData.verifyOtp.user);
      setLiveUser(verifyData.verifyOtp.user);
      setLiveToken(true);
    },
    [verifyOtpMutation],
  );

  const resendOtp = useCallback(
    async (email: string, type: OtpType = "signup") => {
      const { data: resendData } = await resendOtpMutation({
        variables: { email, type },
      });

      return resendData.resendOtp as MessageResponse;
    },
    [resendOtpMutation],
  );

  const forgotPassword = useCallback(
    async (email: string) => {
      const { data: forgotData } = await forgotPasswordMutation({
        variables: { email },
      });

      return forgotData.forgotPassword as MessageResponse;
    },
    [forgotPasswordMutation],
  );

  const resetPassword = useCallback(
    async (email: string, code: string, password: string) => {
      const { data: resetData } = await resetPasswordMutation({
        variables: { email, code, password },
      });

      return resetData.resetPassword as MessageResponse;
    },
    [resetPasswordMutation],
  );

  const logout = useCallback(() => {
    clearAuth();
    setLiveUser(null);
    setLiveToken(false);
  }, []);

  const value = useMemo(
    () => ({
      user: isAuthenticated ? user : null,
      loading,
      isAuthenticated,
      login,
      signup,
      verifyOtp,
      resendOtp,
      forgotPassword,
      resetPassword,
      logout,
    }),
    [
      forgotPassword,
      isAuthenticated,
      loading,
      login,
      logout,
      resendOtp,
      resetPassword,
      signup,
      user,
      verifyOtp,
    ],
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
