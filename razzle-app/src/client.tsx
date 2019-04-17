import React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { createApolloClient } from "./graphql/create-apollo-client";
import App from "./app";

const root = document.getElementById("root");
const client = createApolloClient();

function main(node: typeof root) {
  hydrate(
    <BrowserRouter>
      <App client={client} />
    </BrowserRouter>,
    root,
  );
}

if (module.hot) {
  module.hot.accept();
}

main(root);
