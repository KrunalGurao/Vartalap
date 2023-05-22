const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8998/admin/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, cb) {
        let user = {};
        user.email = profile._json.email;
        user.name = profile._json.name;
        user.icon = profile._json.picture;
        // console.log('from google.configs', user);
        let pass = uuidv4();
        user.password = bcrypt.hashSync(pass, Number(process.env.SALT_ROUNDS))
        return cb(null, user);
    }
));


passport.serializeUser(function (user, done) {
    done(null, user);
})

passport.deserializeUser(function (user, done) {
    done(null, user);
})