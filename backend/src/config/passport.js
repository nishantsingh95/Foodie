const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                return done(null, user);
            }

            // If not, create new user
            // Note: Password is required by schema, we need to handle that or make it optional
            // We'll generate a random dummy password for OAuth users
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: 'GOOGLE_SIGNIN_DUMMY_PASSWORD_' + Math.random(), // Dummy password
                role: 'user', // Default role
                address: '', // Empty address initially
                resetPasswordOtp: undefined,
                resetPasswordExpires: undefined
            });

            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

module.exports = passport;
