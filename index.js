const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');

const { initRoutes } = require('./routes/index.routes');
const errorHandler = require('./errorHandler.middleware');
const { passportInit } = require('./passport.config');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(flash());
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layout/main.ejs');

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
);

passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(initRoutes(passport));

app.use(errorHandler);

mongoose
  .connect('mongodb://localhost:27017/passport-js')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.error(err);
  });
