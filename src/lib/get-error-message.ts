export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const graphQLErrors = "graphQLErrors" in error
      ? (error as { graphQLErrors?: Array<{ message?: string }> }).graphQLErrors
      : undefined;

    if (graphQLErrors?.[0]?.message) {
      return graphQLErrors[0].message;
    }

    const networkError = "networkError" in error
      ? (error as { networkError?: { message?: string; statusCode?: number } }).networkError
      : undefined;

    if (networkError) {
      if (networkError.statusCode === 503) {
        return "The server is temporarily unavailable. Please try again shortly.";
      }

      return "Unable to reach the server. Make sure the API is running on port 5000.";
    }
  }

  if (error instanceof Error) {
    if (error.message.includes("Cannot read properties of undefined")) {
      return "The server returned an unexpected error. Please restart the API and try again.";
    }

    return error.message;
  }

  return "Something went wrong. Please try again.";
}
