import React from "react";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as path from "path";
import { renderToStringWithData } from "react-apollo";
import { renderStylesToString } from "emotion-server";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import "./server/jsdom-mock-browser";

import App from "./app";

import info from "./server/routes/info";
import { createApolloClient } from "./graphql/create-apollo-client";
import { apiProxy } from "./server/proxy";

const publicDir = process.env.RAZZLE_PUBLIC_DIR! || "/public";
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
const isProduction = process.env.NODE_ENV === "production";

export const express_app = express();

if (!isProduction) {
  express_app.use("/graphql", apiProxy);
}

express_app
  .disable("x-powered-by")
  .use(express.static(publicDir))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .use("/info", info)
  .get("/*", async (req: express.Request, res: express.Response) => {
    const context: { url?: string } = {};

    const { tkn = null } = req.cookies;
    const client = createApolloClient(tkn);

    const app = (
      <StaticRouter context={context} location={req.url}>
        <App client={client} />
      </StaticRouter>
    );

    /*
    res.send(
      render({
        assets,
        markup: "",
        apolloCache: client.cache.extract(),
      }));

    return;
    */

    renderToStringWithData(app)
      .then(() => {
        const markup = renderToString(app);
        const markupWithStyles = renderStylesToString(markup);

        if (context.url) {
          res.redirect(context.url);
        } else {
          res.send(
            render({
              assets,
              markup: markupWithStyles,
              apolloCache: client.cache.extract(),
            }),
          );
        }
      })
      .catch((exp) => {
        console.error(`Rendering error: ${exp}`); // eslint-disable-line no-console

        res.status(exp.status || 500);
        res.render("error", { exp });
      });
  });

function render({ assets, markup, apolloCache }) {
  return `
            <!DOCTYPE html>
            <html lang="">

            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="manifest" href="/manifest.json">
                <meta name="robots" content="index, follow" />
                <meta name="theme-color" content="#0099e6" />
                <title>Razzle App</title>
                <link rel="stylesheet" href="app.css">
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
                crossorigin="anonymous">
                ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ""}
                ${
    process.env.NODE_ENV === "production"
      ? `<script src="${assets.client.js}" defer></script>`
      : `<script src="${assets.client.js}" defer crossorigin></script>`
    }
            </head>
            <body class="bg-light d-flex flex-column h-100">
                <link href="https://fonts.googleapis.com/css?family=Black+Han+Sans|Pattaya" rel="stylesheet" lazyload>
                <div id="root" style="height: 100%;">${markup}</div>
                ${renderApolloCache(apolloCache)}
                ${renderServiceWorker()}
                <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
                  integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
                  crossorigin="anonymous"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
                  integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
                  crossorigin="anonymous"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
                  integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
                  crossorigin="anonymous"></script>
            </body>
            </html>
        `;
}

function renderApolloCache(data: Object) {
  return `<script>window.__APOLLO_STATE__ = ${JSON.stringify(data)};</script>`;
}

function renderServiceWorker() {
  return isProduction
    ? `
        <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
            });
        }
        </script>`
    : "";
}
