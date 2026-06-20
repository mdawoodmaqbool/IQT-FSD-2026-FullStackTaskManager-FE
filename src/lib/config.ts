const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl && typeof window !== "undefined") {
  console.warn("NEXT_PUBLIC_API_URL is not set. API requests will fail.");
}

export const config = {
  apiUrl: apiUrl ?? "http://localhost:5000",
} as const;
