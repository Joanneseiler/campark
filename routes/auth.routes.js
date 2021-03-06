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
const {profilePic, username, email, country, password, confirmPassword } = req.body
if ( !username || !email || !country || !password || !confirmPassword ) { 
    res.render('auth/signup.hbs', {error: 'Please enter all fields', username, email, country, password, confirmPassword})
    return
}

// Check for email
const re4 = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //isso é regular expression (isso é para criar um padrão que deve ter o email)
if ( !re4.test(email)) {
    res.render('auth/signup.hbs', {error: 'Email not in valid format'})
    return;
  }
 // Check for password
const re2 = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
if ( !re2.test(password)) {
    res.render('auth/signup.hbs', {error: 'Password needs to have a special character, a number, and be 6-16 characters'})
    return;
  }
if ( !password === confirmPassword) {
    res.render('auth/signup.hbs', {error: "The two passwords don't match"})
    return;
}

const salt = bcrypt.genSaltSync(10);

const hash = bcrypt.hashSync(password, salt);

  User.findOne({ username })
              .then(user => {
                if (!user) {
                  User.create({ profilePic, username, country, email, password: hash })
                  .then((user) => {
                    req.session.loggedInUser = user
                    req.app.locals.isLoggedIn = true;
                    res.redirect('/profile')                  
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
    const {username, password} = req.body
    console.log('reqbody is ', req.body)
    User.findOne({username})
      .then((user) => {
        if (user) { 
          console.log('user found')
          let isPasswordMatching = bcrypt.compareSync(password, user.password)
          console.log('password status', isPasswordMatching)
          if (isPasswordMatching) {
            req.session.loggedInUser = user
            res.redirect("/profile")
          } else{
            res.render("auth/signin", {error: "Incorrect password"})
          }
        } else {
          res.render("auth/signin", { error: "Username does not exist"})
        }

      })
      .catch((err) => {
          next(err)
      }) 


});



router.get('/auth/google',
  passport.authenticate('google', { scope: //scope specifies which user's Google information that we want our app to get access to
  	[ 'email', 'profile' ]  //we want only email and profile give access to name, photo, and language preference)
  }
));
 
router.get('/auth/google/callback', (req, res, next) => //this page will redirect the user to the redirect URI which we set up (this url needs to be in Google Developers Console)
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      return next(err)
    }

    if  (!user) { 
      console.log("user not existent")
      return res.redirect('/signup')
    }
    
    req.session.loggedInUser = user
    req.app.locals.isLoggedIn = true;
    return res.redirect('/profile');

  })(req, res, next)
);

router.get('/logout', (req, res, next) => {
  req.session.destroy(function(e){
    req.logout();
    req.app.locals.isLoggedIn = false;
    res.redirect('/');
  }); 
})

module.exports = router;