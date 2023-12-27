const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
require('dotenv').config();
const User = require('../model/User');

passport.use(new JwtStrategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async(payload, done) => {
    const user = await User.findById(payload.sub);
    if(user){
        done(null, {id: user._id});
    }else{
        done(null, false);
    }
}));

passport.serializeUser((user, done)=> {
    done(null, user.id);
});

passport.deserializeUser(async(user, done) => {
    done(null, user.id);

});

module.exports = passport;
