const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy; 

router.get('/auth', (req, res, next) => {
    res.render('auth/auth.hbs')
})

router.post('/signup', (req, res, next) => {
const { username, email, country, password, confirmPassword } = req.body
if ( !username || !email || !country || !password || !confirmPassword ) { 
    res.render('auth/auth.hbs', {error: 'Please enter all fields'})
    return
}

// // Check for email
// const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //isso é regular expression (isso é para criar um padrão que deve ter o email)
// if ( !re.test(email)) {
//     res.render('auth/auth.hbs', {error: 'Email not in valid format'})
//     return;
//   }
//  // Check for password
// const re2 = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
// if ( !re2.test(password)) {
//     res.render('auth/auth.hbs', {error: 'Password needs to have a special character, a number, and be 6-16 characters'})
//     return;
//   }
// if ( !password === confirmPassword) {
//     res.render('auth/auth.hbs', {error: "The two passwords don't match"})
//     return;
// }

const salt = bcrypt.genSaltSync(10);

const hash = bcrypt.hashSync(password, salt);

User.create({ username, country, email, password: hash })
      .then(() => {
          res.render('user/profile.hbs')
      })
      .catch((err) => {
          next(err)
      })
})

router.post('/signin', (req, res, next) => {
    passport.authenticate('local', (err, theUser, failureDetails) => {
      if (err) {
        // Something went wrong authenticating user
        return next(err);
      }
   
      if (!theUser) {
        // Unauthorized, `failureDetails` contains the error messages from our logic in "LocalStrategy" {message: '…'}.
        res.render('auth/auth', { error: failureDetails.message });
        return;
      }
   
      // save user in session: req.user
      req.login(theUser, err => {
        if (err) {
          // Session save went bad
          return next(err);
        }
   
        // All good, we are now logged in and `req.user` is now set
        res.redirect('/');
      });
    })(req, res, next);
  });



router.get('/auth/google',
  passport.authenticate('google', { scope:
  	[ 'email', 'profile' ] }
));
 
router.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/profile',
        failureRedirect: '/auth'
}));


router.get('/profile', (req, res, next) => {
    if (!req.user) {
        res.redirect('/login'); // can't access the page, so go and log in
        return;
      }
     
      // ok, req.user is defined
      res.render('user/profile', { user: req.user });
})

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy()
    res.redirect('/');
})

module.exports = router;