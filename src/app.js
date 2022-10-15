const express = require("express");
const apiRoutes = require("./routes");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const { encryptCookieNodeMiddleware } = require("encrypt-cookie");

const db = require("./db");

require("dotenv").config();

const port = process.env.PORT;
const app = express();

// Because OAuth uses redirection, a proxy port is required to
// redirect to the main proxy server that is defined in the OAuth app
const PROXY_PORT = process.env.PROXY_PORT ?? port;

if (!port && process.env.NODE_ENV !== "test") {
  console.error("A port have to be specified in environment variable PORT");
  process.exit(1);
}

if (process.env.NODE_ENV !== "test") {
  db.connect().then(() => {
    console.info("Connected to db");
  });
}

app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser(process.env.SECRET_KEY));
app.use(encryptCookieNodeMiddleware(process.env.SECRET_KEY));

app.use("/api", apiRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`API Server started on port ${port}`);
    console.log(
      `Proxy server started on port ${PROXY_PORT}. Head to https://3000-rcdd202203t-awesometodo-i1939dy7ju3.ws-eu47.gitpod.io:${PROXY_PORT} and start hacking.`
    );
  });
}

module.exports = app;
