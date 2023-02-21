require("dotenv").config();
require("./db/mongoose");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const app = express();
const routes = require("./routes");

const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
});

app.use(
  cors({
    origin: [process.env.DEVELOPMENT_URL, process.env.PRODUCTION_URL],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true })); // Required for mongoSanitize to work
app.use(bodyParser.json({ limit: "50mb" })); // Required for mongoSanitize to work
app.use(mongoSanitize({})); // Data sanitization against NoSQL query injection
app.use(cookieParser());
app.use(express.json());

app.use("/api", rateLimiter, routes);

// Point the server to the build folder of the React app
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
