// Import necessary modules
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { User } from "../../models/User.js"; // General User model
import { GoogleUser } from "../../models/GoogleUser.js"; // Specific GoogleUser model

// Serialize the user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await GoogleUser.findByPk(id); // Use findByPk for primary key
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        let existingUser = await GoogleUser.findOne({
          where: { googleId: profile.id },
        });

        if (existingUser) {
          // User already exists, pass the user to the done function
          done(null, existingUser);
        } else {
          // User doesn't exist, create a new one
          const newUser = await GoogleUser.create({
            username: profile.displayName,
            googleId: profile.id,
          });
          done(null, newUser);
        }
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
