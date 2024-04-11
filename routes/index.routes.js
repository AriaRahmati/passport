const { hashSync } = require('bcrypt');
const { Router } = require('express');
const { userModel } = require('../model/user.model');
const { redirectIfIsAuth, checkAuthenticated } = require('../middleware');

const router = Router();

const initRoutes = (passport) => {
  router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
  });

  router.get('/register', redirectIfIsAuth, (req, res) => {
    res.render('register', { title: 'Register' });
  });

  router.post('/register', redirectIfIsAuth, async (req, res, next) => {
    try {
      const { fullname: fullName, username, password } = req.body;

      const hashedPassword = hashSync(password, 15);

      const user = await userModel.findOne({ username });
      if (user) {
        req.flash('error', 'Username already exists');
        return res.redirect(req.headers.referer ?? '/register');
      }

      await userModel.create({
        fullName,
        username,
        password: hashedPassword,
      });

      res.redirect('/login');
    } catch (error) {
      next(error);
    }
  });

  router.get('/login', redirectIfIsAuth, (req, res) => {
    res.render('login', { title: 'Login', messages: [] });
  });

  router.post(
    '/login',
    redirectIfIsAuth,
    passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/login', failureFlash: true }),
    async (req, res, next) => {
      res.redirect('/profile');
    }
  );

  router.get('/logout', (req, res) => {
    req.logOut({ keepSessionInfo: false }, (err) => {
      if (err) {
        console.error(err);
      } else {
        res.redirect('/login');
      }
    });
  });

  router.get('/profile', checkAuthenticated, (req, res) => {
    const user = req.user;
    res.render('profile', { title: 'Profile', user });
  });

  return router;
};

module.exports = {
  initRoutes,
};
