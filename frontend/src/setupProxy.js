const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware("/websocket", {
      target: "ws://localhost:5000",
      ws: true,
      logLevel: "debug",
    })
  );
};
