const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy; 



router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs', {title: 'sign up or sign in'})
})

router.get('/signin', (req, res, next) => {
  res.render('auth/signin.hbs', {title: 'sign up or sign in'})
})

router.post('/signup', (req, res, next) => {
const { username, email, country, password, confirmPassword } = req.body
if ( !username || !email || !country || !password || !confirmPassword ) { 
    res.render('auth/signup.hbs', {error: 'Please enter all fields', username, email, country, password, confirmPassword})
    return
}

// // Check for email
// const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //isso é regular expression (isso é para criar um padrão que deve ter o email)
// if ( !re.test(email)) {
//     res.render('auth/signup.hbs', {error: 'Email not in valid format'})
//     return;
//   }
//  // Check for password
// const re2 = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
// if ( !re2.test(password)) {
//     res.render('auth/signup.hbs', {error: 'Password needs to have a special character, a number, and be 6-16 characters'})
//     return;
//   }
// if ( !password === confirmPassword) {
//     res.render('auth/signup.hbs', {error: "The two passwords don't match"})
//     return;
// }

const salt = bcrypt.genSaltSync(10);

const hash = bcrypt.hashSync(password, salt);

  User.findOne({ username })
              .then(user => {
                if (!user) {
                  User.create({ username, country, email, password: hash })
                  .then((user) => {
                    passport.authenticate('local', (err, user, failureDetails) => {
                      // save user in session: req.user
                      req.login(user, err => {
                        if (err) {
                          // Session save went bad
                          return next(err);
                        }
                   
                        // All good, we are now logged in and `req.user` is now set
                        console.log('req user ' + req.user)
                        req.app.locals.isLoggedIn = true;
                        return res.redirect('/profile')
                      });
                    })(req, res, next);                   
                  })
                  .catch((err) => {
                      next(err)
                  })
                } else {
                  return res.render('auth/signup.hbs', {error: 'Username already registered.'})
                }
              })
})

router.post('/signin', (req, res, next) => {
    passport.authenticate('local', (err, theUser, failureDetails) => {
      if (err) {
        // Something went wrong authenticating user
        return next(err);
        
      }
   
      if (!theUser) {
        console.log(failureDetails.message)
        // Unauthorized, `failureDetails` contains the error messages from our logic in "LocalStrategy" {message: '…'}.
        return res.render('auth/signin.hbs', {title:'sign in or sign up', error: failureDetails.message });
      }
   
      // save user in session: req.user
      req.login(theUser, err => {
        if (err) {
          // Session save went bad
          return next(err);
        }
   
        // All good, we are now logged in and `req.user` is now set
        req.app.locals.isLoggedIn = true;
        return res.redirect('/profile')
      });
    })(req, res, next);
});



router.get('/auth/google',
  passport.authenticate('google', { scope:
  	[ 'email', 'profile' ] }
));
 
router.get('/auth/google/callback', (req, res, next) =>
  passport.authenticate('google', (err, user, info) => {
    if (err) return next(err);

    if  (!user) return res.redirect('/signup');
    req.app.locals.isLoggedIn = true;
    return res.redirect('/profile');

  })(req, res, next)
);

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy()
    req.app.locals.isLoggedIn = false;
    res.redirect('/');
 
})

module.exports = router;