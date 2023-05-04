
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport")


// passport.use(new GoogleStrategy({
//     clientID: "1044555666075-pa5siir8m46p5g1sc18p6jtnmgi0p8i5.apps.googleusercontent.com",
//     clientSecret: "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",
//     callbackURL: "http://localhost:8080/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     console.log(accessToken, refreshToken, profile)
//     return cb (`Hey ${profile._json.name}, you are successfully sign in with Google`)
//   }
// ));



// module.exports= GoogleStrategy