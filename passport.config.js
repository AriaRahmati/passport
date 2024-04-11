const { Strategy: LocalStrategy } = require('passport-local');
const { userModel } = require('./model/user.model');
const { compareSync } = require('bcrypt');

const passportInit = (passport) => {
  const authenticatedUser = async (username, password, done) => {
    try {
      const user = await userModel.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'not found user account' });
      }

      if (!compareSync(password, user.password)) {
        return done(null, false, { message: 'incorrect credentials' });
      }

      return done(null, user);
    } catch (error) {
      done(error);
    }
  };

  const localStrategy = new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, authenticatedUser);
  const serializeUser = passport.serializeUser((user, done) => done(null, user.id));
  const deserializeUser = passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      if (!user) {
        return done(null, false, { message: 'not found user account' });
      }

      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use('local', localStrategy, serializeUser, deserializeUser);
};

module.exports = {
  passportInit,
};
