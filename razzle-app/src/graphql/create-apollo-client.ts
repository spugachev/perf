import fetch from "node-fetch";
import { HttpLink, ApolloClient, InMemoryCache } from "apollo-boost";
import { setContext } from "apollo-link-context";
import { ApolloProviderProps } from "react-apollo";
import { defaultOptions } from "./apollo-options";

let apolloClient: ApolloProviderProps<any>["client"] | null = null;

// @ts-ignore
const state = global.__APOLLO_STATE__;
const graphQLUrl = process.env.RAZZLE_API_GRAPHQL_PATH || "http://localhost:5001/graphql";

const httpLink = new HttpLink({
  fetch: fetch as any,
  uri: graphQLUrl,
  credentials: "include",
});


function createInstance(token: string | null) {
  let cache = new InMemoryCache({
    dataIdFromObject: (object) => (object.id ? `${object.__typename}_${object.id}` : null),
  });

  cache = cache.restore(state);

  let link: any = httpLink;
  if (token != null) {
    const authLink = setContext((param: any, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: token || "",
        },
      };
    });

    link = authLink.concat(httpLink);
  }

  const client = new ApolloClient({
    cache,
    link,
    // note: @types/nodejs foes not expose process.browser
    // @ts-ignore
    ssrMode: !process.browser,
    // @ts-ignore
    connectToDevTools: !process.browser,
    defaultOptions,
  });

  return client;
}

function createApolloClient(token: string | null = null) {
  // @ts-ignore
  if (!process.browser) {
    // Make sure to create a new client for every server-side request so that data
    // isn't shared between connections (which would be bad)

    return createInstance(token);
  }

  if (!apolloClient) {
    apolloClient = createInstance(token);
  }

  return apolloClient;
}

export { createApolloClient };
