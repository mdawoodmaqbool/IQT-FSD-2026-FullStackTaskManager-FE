const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;

if (!graphqlUrl && typeof window !== "undefined") {
  console.warn("NEXT_PUBLIC_GRAPHQL_URL is not set. GraphQL requests will fail.");
}

export const config = {
  apiUrl: apiUrl ?? "http://localhost:5000",
  graphqlUrl: graphqlUrl ?? "http://localhost:5000/graphql",
} as const;
