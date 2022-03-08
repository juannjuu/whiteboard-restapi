const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/user");
const Profile = require("../models/profile");

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
                    name: profile.displayName,
                    password: "123"
                });
                const imageProfile = await Profile.create({ userId: user._id }, { image: profile.photos[0].value });
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