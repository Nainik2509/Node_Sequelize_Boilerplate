const express = require("express");
const app = express();
const path = require("path");
const passport = require("passport");
const compress = require("compression");
const APIError = require("../helpers/api_error");
const {
  ValidationErrorHandler,
  ErrorHandler,
} = require("../helpers/error_handler");
const { Jwt } = require("./passport");

const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

// Parse JSON playload
app.use(express.json({}));
// Parse URl-Encoded Data
app.use(express.urlencoded({ extended: true }));

// Compressing Request Middleware
app.use(compress());

// Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(helmet());

// Allowimg CORS
app.use(cors());
app.options("*", cors());

// Parse Cookie header and populate req.cookies
app.use(cookieParser());

// Make Public folder static
app.use(express.static(path.join(__dirname, "../public")));

// passport authentication middleware
app.use(passport.initialize());
passport.use("jwt", Jwt);

// Routes - /v1
app.use("/api/v1", require("../api/routes/"));

// Global Error Handler
app.use(ValidationErrorHandler);
app.use(ErrorHandler);

// Throw Path NOT FOUND
app.all("*", (req, res, next) => {
  const ApiError = new APIError(
    `Can't find ${req.originalUrl} on this server!`,
    null,
    404
  );
  return ErrorHandler(ApiError, req, res, next);
});

module.exports = app;
