const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

const redirectIfIsAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/profile');
  }
  next();
};

module.exports = {
  checkAuthenticated,
  redirectIfIsAuth,
};
