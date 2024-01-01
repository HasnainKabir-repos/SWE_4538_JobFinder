const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require("../model/User");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
function initialize(passport) {
  const authenticateUser = async (email, password, done) => {

       User.findOne({ email: email })
       .then((user) => {
         if (!user) {
            console.log("User not found");
           return done(null, false, {
             message: "User not found",
           });
         } else {
           bcrypt.compare(password, user.password, (err, isMatch) => {
             if (err) throw err;
             if (isMatch) {
               return done(null, user);
             } else {
                console.log('incorrect password');
               return done(null, false, { message: "Incorrect Password" });
             }
           });
         }
       })
       .catch((err) => {
         console.log(err);
       });
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser)) 

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {

    try{
        const user = await User.findOne({email : profile.emails[0].value});

        if(!user){
            const newUser = {
                name:profile.displayName,
                email:profile.emails[0].value , 
                googleid: profile.id
            }

            const n = await User.create(newUser);
            return cb(null, n);
        }else{
            return cb(null, user);
        }
    }catch(error){
        console.log(error);
        return cb(error);
    }
  }
));

  passport.serializeUser((user, done) =>{
    done(null, user.id)
  }) 
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}

module.exports = initialize;