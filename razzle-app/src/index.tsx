import http, { Server } from "http";
import { debug, log } from "./server/logger";
import { express_app } from "./server";

const port = process.env.NODE_PORT || "3000";
const server: Server = http.createServer(express_app);

let currentApp = express_app;
server.listen(port, () => {
  log(`App started on http://localhost:${port}`);
});

if (module.hot) {
  debug("Server-side HMR Enabled!");

  module.hot.accept("./server", () => {
    debug("HMR Reloading `./server`...");
    server.removeListener("request", currentApp);
    const newApp = require("./server").express_app;
    server.on("request", newApp);
    currentApp = newApp;
  });
}
