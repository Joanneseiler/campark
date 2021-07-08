// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
// const projectName = "campark";
// const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

// app.locals.title = `${capitalized(projectName)} created with IronLauncher`;


//registering Helpers
hbs.registerHelper('listEmpty', function (list) { return list === 0});

//registering Partials
hbs.registerPartials(__dirname + '/views/partials')

const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models/User.model');



passport.serializeUser((user, cb) => cb(null, user._id));
 
passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then(user => cb(null, user))
    .catch(err => cb(err));
});
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username', // by default
      passwordField: 'password' // by default
    },
    (username, password, done) => {
      User.findOne({ username })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'Incorrect username' });
          }
 
          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect password' });
          }
 
          done(null, user);
        })
        .catch(err => done(err));
    }
  )
);

if (process.env.CLIENT_ID && process.env.CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
          {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "https://campark.herokuapp.com/auth/google/callback"
          },
          (accessToken, refreshToken, profile, done) => {
            // to see the structure of the data in received response:
            console.log("Google account details here:", profile); //tha data that we want to access is in profile._json
       
            User.findOne({ googleID: profile.id}) //Since we only want one user record no matter how many times the user signs in, first our app needs to check whether our database already has this user with the given Google profile ID.
             
            .then(user => {
                if (user) {//if we already have a record with the given profile ID
   
                  done(null, user); //done function: this is called to tell passport that we have finished looking up or creating a user and it should now proceed with the authentication flow.
                  return;
                }
                //if the user doesn't exist yet, create a new user:
                User.create({ googleID: profile.id, username: profile._json.name, profilePic: profile._json.picture, email: profile._json.email})
                  .then(newUser => {
                    done(null, newUser);
                  })
                  .catch(err => done(err)); // closes User.create()
              })
              .catch(err => {
                console.log('see hereeeeeee')
                done(err)
              }); // closes User.findOne()
          }
        )
    );
}


// creating sessions
app.use(session({
  secret: process.env.SESSION_SECRET || "bad_secret", 
  resave: false, 
  saveUninitialized: false,
  cookie: {
      maxAge: 10000 * 24 * 60 * 60 
  },
  store: MongoStore.create({ //store all the session informations
  mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/campark",
  // Time to Live for sessions in DB. After that time it will delete it!
  ttl: 24 * 60 * 60 //isso é para setar o tempo máximo da sessão. É sempre em segundos e esse cálculo converte um dia para segundos
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next) => {
  
  req.app.locals.profilePic = "images/default-avatar.png"
  if (req.app.locals.isLoggedIn) {
     req.app.locals.profilePic = req.session.loggedInUser.profilePic
  }  
  req.app.locals.isLoggedIn = !!req.session.loggedInUser;
  next()
})

// 👇 Start handling routes here
const homeRoutes = require("./routes/home.routes");
app.use("/", homeRoutes);

const placesRoutes = require("./routes/places.routes")
app.use("/", placesRoutes)

const auth = require("./routes/auth.routes")
app.use("/", auth)

const userRoutes = require('./routes/user.routes.js')
app.use("/", userRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);


module.exports = app;
