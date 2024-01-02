const express = require('express');
const app = express();
const passport = require("passport");
const cors = require("cors");
const flash = require("flash");
const session = require("express-session");
require("./config/passport")(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
      secret:"secret",
      resave: false,  
      saveUninitialized: false, 
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));

app.get('/', (req, res) => {
    res.status(200).json({message : "Hello world"});
});


const auth = require('./routes/auth.route');

app.use('/auth', auth);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  function(req, res) {
    res.redirect('/auth/welcome');
  });

const jobs = require('./routes/job.route');

app.use('/job', jobs);

const profile = require('./routes/profile.route');
app.use('/profile', profile);

module.exports = app;