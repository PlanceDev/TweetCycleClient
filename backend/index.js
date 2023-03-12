require("dotenv").config();
require("./db/mongoose");
const http = require("http");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const app = express();
const routes = require("./routes");

const { SendTweets } = require("./utils/automateTweets");
const { handleCompletedPayment } = require("./utils/stripeHooks");

const server = http.createServer(app);

const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per minute
});

app.use(
  cors({
    origin: [
      process.env.DEVELOPMENT_URL,
      process.env.PRODUCTION_URL,
      "http://127.0.0.1:3001",
    ],
    credentials: true,
  })
);

app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleCompletedPayment
);

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    // redirect http to https
    if (req.header("x-forwarded-proto") !== "https")
      return res.redirect(`https://${req.header("host")}${req.url}`);

    // replace www with non-www
    if (req.header("host").startsWith("www.")) {
      return res.redirect(
        301,
        `https://${req.header("host").replace("www.", "")}${req.url}`
      );
    }

    next();
  });
}

app.use(bodyParser.urlencoded({ extended: true })); // Must be placed above mongoSanitize for mongoSanitize to work
app.use(bodyParser.json({ limit: "50mb" })); // Must be placed above mongoSanitize for mongoSanitize to work
app.use(mongoSanitize({})); // Data sanitization against NoSQL query injection
app.use(cookieParser());
app.use(express.json());
app.use("/api", rateLimiter, routes);

// Point the server to the build folder of the app
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"));
  });
}

// Run task every minute
SendTweets.start();

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// prevent uncaughtException from crashing the app
process.on("uncaughtException", (err) => {
  console.log("uncaughtException", err);
});
