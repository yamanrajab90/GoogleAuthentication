const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GAPP_CLIENT_ID,
      clientSecret: process.env.GAPP_CLIENT_SECRET,
      callbackURL:
        "https://3000-rcdd202203t-awesometodo-i1939dy7ju3.ws-eu47.gitpod.io/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, callBack) => {
      const currentUser = await User.findOne({ providerId: profile.id });

      if (currentUser) {
        callBack(null, currentUser);
      } else {
        const newUser = new User({
          email: profile._json.email,
          name: profile.displayName,
          providerId: profile.id,
          profilePicture: profile._json.picture,
          firstName: profile._json.given_name,
          lastName: profile._json.family_name,
          provider: profile.provider,
        });

        newUser.save();
        callBack(null, newUser);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});
