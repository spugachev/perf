import proxy from "http-proxy-middleware";

const isProduction = process.env.NODE_ENV === "production";
let apiProxy: any = null;

if (!isProduction) {
  apiProxy = proxy({
    target: process.env.API_HOST || "http://localhost:5001",
    changeOrigin: true,
    logLevel: "info",
    secure: false,
  });
}

export { apiProxy };
