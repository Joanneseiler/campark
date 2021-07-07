const router = require('express').Router();
const User = require('../models/User.model');
const Places = require('../models/Place.model');
const Reviews = require('../models/Review.model');
const Place = require('../models/Place.model');
const bcrypt = require('bcryptjs');
const uploader = require('../config/cloudinary.config.js');

router.get('/profile', (req, res, next) => {
    // if (!req.session.loggedInUser) {
      if(!req.user && !req.session.loggedInUser){
        console.log("nao is here" +  req.user)
        console.log("nao is here" + req.session.loggedInUser )
        res.redirect('/signin'); // can't access the page, so go and log in
        return;
      }
      // When the login operation completes, user will be assigned to req.user. This function is primarily used when users sign up, during which req.login() can be invoked to automatically log in the newly registered user.
      req.app.locals.isLoggedIn = true;
      let mainUser = req.session.loggedInUser
      console.log("mainUser " + mainUser  + "\n")

      if (mainUser === undefined) {
         mainUser = req.user
         console.log("!mainUser === undefined " + mainUser + "\n" )
      } 
      console.log('Mariana-Joanne see here' , mainUser)
    User.findOne({_id: mainUser._id})
    .populate("placesAdded")
    .populate("placesVisited")
    .then((user) => {
      res.render('user/profile', {title: mainUser.username, username: mainUser.username, country: mainUser.country, profilePic: mainUser.profilePic, placesAdded: user.placesAdded, placesVisited: user.placesVisited});
    })
    .catch((err) => {
      next(err)
    })
})

router.get('/account', (req, res, next) => {
  if (!req.user) {
    res.redirect('/signin'); // can't access the page, so go and log in
    return;
  }
  res.render('user/account.hbs', {title: `${req.user.username}'s account`, username: req.user.username, email: req.user.email, country: req.user.country, profilePic: req.user.profilePic})
})

router.post('/account/edit', uploader.single("profilePic"), (req, res, next) => {
// the uploader.single() callback will send the file to cloudinary and get you and obj with the url in return
console.log('file is: ', req.file)

  let { username, email, country, password, confirmPassword } = req.body
  if ( !username || !email || !country || !password || !confirmPassword ) { 
    res.render('auth/signup.hbs', {error: 'Please enter all fields'})
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

  let userId = req.user._id
  let profilePic = ""
  if (req.file) {
    profilePic = req.file.path
  }

 
  if(username === req.user.username ) {
    if(profilePic === "") {
      User.findByIdAndUpdate({_id: userId}, {username, email, country, password:hash}, {new: true})
      .then((userUpdated) => {
        req.session.user = userUpdated
        res.redirect('/profile')
      })
      .catch((err) => {
        next(err)
      })
    } else {
      User.findByIdAndUpdate({_id: userId}, {profilePic, username, email, country, password:hash}, {new: true})
      .then((userUpdated) => {
        req.session.user = userUpdated
        res.redirect('/profile')
      })
      .catch((err) => {
        next(err)
      })
    }
    
  } else {
    User.findOne({username})
    .then((user) => {
      if(!user){
        if(profilePic === "") {
          User.findByIdAndUpdate({_id: userId}, {username, email, country, password:hash}, {new: true})
          .then((userUpdated) => {
            req.session.user = userUpdated
            res.redirect('/profile')
          })
          .catch((err) => {
            next(err)
          })
        } else {
          User.findByIdAndUpdate({_id: userId}, {profilePic, username, email, country, password:hash}, {new: true})
          .then((userUpdated) => {
            req.session.user = userUpdated
            res.redirect('/profile')
          })
          .catch((err) => {
            next(err)
          })
        }
        
      } else {
        res.render('user/account.hbs', {error: 'Username already exists'})
      }
    })
  }
})

router.post('/account/delete', (req, res, next) => {
  User.findOneAndRemove({_id: req.user._id})
  .then(() => {
    req.session.destroy(function(e){
      req.logout();
      req.app.locals.isLoggedIn = false;
      res.redirect('/');
    }); 
  })
  .catch((err) => {
    next(err)
  })
})

module.exports = router;