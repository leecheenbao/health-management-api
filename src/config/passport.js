const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
const googleConfig = require('./google');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new GoogleStrategy(googleConfig,
    async (accessToken, refreshToken, profile, done) => {
        try {
            // 查找或創建用戶
            const [user, created] = await User.findOrCreate({
                where: { email: profile.emails[0].value },
                defaults: {
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    google_id: profile.id,
                    avatar_url: profile.photos[0].value,
                    is_active: true,
                    privacy_agreed: true
                }
            });

            // 記錄登入
            await user.createLoginRecord();

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
));

module.exports = passport; 