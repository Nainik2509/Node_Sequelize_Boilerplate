const { JWT_SECRET } = require("./env_vars");
const User = require("../api/models/user");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
  secretOrKey: JWT_SECRET,
};

const JWT = async (payload, done) => {
  try {
    User.findByPk(payload.id).then((user) => {
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    });
  } catch (error) {
    return done(err, false);
  }
};

exports.Jwt = new JwtStrategy(JwtOptions, JWT);
