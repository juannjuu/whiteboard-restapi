const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/user");
const findOrCreate = require("mongoose-find-or-create");
// passport.use(
//     new FacebookStrategy({
//             clientID: "",
//             clientSecret: "",
//             callbackURL: "",
//         },
//         function(accessToken, refreshToken, profile, cb) {
//             cb(null, profile);
//             User.findOrCreate({ facebookId: profile.id }, function(err, user) {
//                 return cb(err, user);
//             });
//         }
//     )
// );

passport.use(
    "google",
    new GoogleStrategy({
            clientID: "940474167336-thrrdmsfle2qbuj3p0afkaq1j5ig5cu5.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
        },
        async function(accessToken, refreshToken, profile, cb) {
            const findUser = await User.findOne({
                email: profile.emails[0].value
            })

            console.log(findUser)
        }
    )
);

module.exports = passport;