export type User = {
  id: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
};

export type AuthPayload = {
  token: string;
  user: User;
};

export type MessageResponse = {
  message: string;
  email?: string;
};

export type OtpType = "signup" | "reset_password";
