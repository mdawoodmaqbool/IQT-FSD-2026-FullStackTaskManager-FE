import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { config } from "./config";

export function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: config.graphqlUrl,
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            tasks: {
              keyArgs: ["status"],
              merge(_existing, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
      query: {
        fetchPolicy: "cache-first",
      },
    },
  });
}
