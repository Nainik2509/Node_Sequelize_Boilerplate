const passport = require("passport");
const APIError = require("../helpers/api_error");
const {
  UNAUTHORIZED,
  UNAUTHORIZE_ERROR,
  ADMIN,
  FORBIDDEN,
  FORBIDDEN_ERROR,
  AUTH_ROLES,
} = require("../helpers/constants");

const handleJWT = (req, res, next, roles) => (err, user, info) => {
  const error = err;
  // Not authorize error from passport
  let authError = new APIError(
    error ? error.message : UNAUTHORIZE_ERROR,
    null,
    UNAUTHORIZED
  );
  if (err || !user) {
    return next(authError);
  }
  // Checking authentication roles
  // Admin Role
  if (roles === ADMIN) {
    if (user.role !== "Admin" || user.status !== "Active") {
      authError = new APIError(FORBIDDEN_ERROR, null, FORBIDDEN);
      return next(authError);
    }
  }
  // Check for multiple roles
  else if (![...roles].includes(user.role) || user.status !== "Active") {
    authError = new APIError(FORBIDDEN_ERROR, null, FORBIDDEN);
    return next(authError);
  }

  req.user = user;
  return next();
};

exports.Authorize =
  (roles = AUTH_ROLES) =>
  (req, res, next) =>
    passport.authenticate(
      "jwt",
      { session: false },
      handleJWT(req, res, next, roles)
    )(req, res, next);
