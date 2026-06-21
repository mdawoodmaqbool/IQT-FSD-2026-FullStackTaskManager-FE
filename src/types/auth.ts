export type User = {
  id: string;
  email: string;
  countryCode: string;
  countryName: string;
  isVerified: boolean;
  createdAt: string;
};

export type Country = {
  code: string;
  name: string;
  capital: string | null;
};

export type Weather = {
  countryCode: string;
  countryName: string;
  location: string;
  temperatureC: number;
  humidity: number;
  windSpeedKmh: number;
  condition: string;
  observedAt: string;
  source: string;
};

export type AuthPayload = {
  token: string;
  user: User;
};

export type MessageResponse = {
  message: string;
  email?: string;
};
