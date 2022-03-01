const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/user");
const Profile = require("../models/profile");
passport.use(
    new FacebookStrategy({
            clientID: "5557319487616869",
            clientSecret: "f9bcef0d6c031f2b56178d7d94a128c5",
            callbackURL: "http://localhost:5000/api/v1/auth/facebook/callback",
        },
        function(accessToken, refreshToken, profile, cb) {
            cb(null, profile);
            User.findOrCreate({ facebookId: profile.id }, function(err, user) {
                return cb(err, user);
            });
        }
    )
);

passport.use(
    "google",
    new GoogleStrategy({
            clientID: "940474167336-thrrdmsfle2qbuj3p0afkaq1j5ig5cu5.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
        },
        async function(accessToken, refreshToken, profile, cb) {
            const findUser = await User.findOne({
                email: profile.emails[0].value,
            });
            if (!findUser) {
                const user = await User.create({
                    email: profile.emails[0].value,
                    name: profile.displayName.value,
                });
                const imageProfile = await Profile.create({ userId: findUser._id }, { image: profile.photos[0].value });
                console.log(user);
                console.log(imageProfile);
                cb(null, user);
            } else {
                cb(null, findUser);
            }
        }
    )
);

module.exports = passport;