const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const BACKEND_URL = process.env.BACKEND_URL || "https://foodie-backend-2bpt.onrender.com"; // Default to prod if env missing, or "http://localhost:5000" for local
// Use explicit production URL if we are in production environment (typically implies NODE_ENV=production)
// However, safest is to trust the environment variable or fallback to a hardcoded prod string if we suspect env issues.

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // Use an absolute URL to avoid protocol ambiguity (http vs https)
    callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
    proxy: true
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
