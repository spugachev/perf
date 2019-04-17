import http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import path from "path";
import cors from "cors";
import { infoRouter, apiRouter } from "./routes";

const isDev = process.env.NODE_ENV === "development";
const port = process.env.NODE_PORT || "5001";
const corsOrigin = "*";
const infoRootPath = "/info";

const app = express();

if (isDev) {
  app.use(cors({ credentials: true, origin: corsOrigin }));
}

app
  .disable("x-powered-by")
  .set("view engine", "ejs")
  .use("/", express.static(path.join(__dirname, "../public")))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(infoRootPath, infoRouter)
  .use("/", apiRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: any, res: any, next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = isDev ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port  ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address() || { port: "" };
  const bind = typeof addr === "string" ? `pipe ${addr}` : `http://localhost:${addr.port}`;

  console.log(`Listening on ${bind}`);
}

const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
