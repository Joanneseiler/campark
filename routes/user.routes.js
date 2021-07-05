const router = require('express').Router();
const User = require('../models/User.model');
const Places = require('../models/Place.model');
const Reviews = require('../models/Review.model');
const Place = require('../models/Place.model');
const bcrypt = require('bcryptjs');

router.get('/profile', (req, res, next) => {
    if (!req.user) {

        res.redirect('/signin'); // can't access the page, so go and log in
        return;
      }
      // ok, req.user is defined
      req.app.locals.isLoggedIn = true;
    User.findOne({_id: req.user._id})
    .populate("placesAdded")
    .then((user) => {
      res.render('user/profile', {title: req.user.username, username: req.user.username, country: req.user.country, image: req.user.profilePic, placesAdded: user.placesAdded, placesVisited: req.user.placesVisited});
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

router.post('/account/edit', (req, res, next) => {
  let { profilePic, username, email, country, password, confirmPassword } = req.body
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
  if (profilePic === "") {
    profilePic = "images/default-avatar.png"
  } else {
    req.app.locals.profilePic = profilePic
  }

  if(username === req.user.username ) {
    User.findByIdAndUpdate({_id: userId}, {profilePic, username, email, country, password:hash}, {new: true})
    .then((userUpdated) => {
      console.log(userUpdated + "1")
      req.session.user = userUpdated
      res.redirect('/profile')
    })
    .catch((err) => {
      next(err)
    })
  } else {
    User.findOne({username})
    .then((user) => {
      if(!user){
        User.findByIdAndUpdate({_id: userId}, {profilePic, username, email, country, password:hash}, {new: true})
        .then((userUpdated) => {
          console.log(userUpdated + "2")
          req.session.user = userUpdated
          res.redirect('/profile')
        })
        .catch((err) => {
          next(err)
        })
      } else {
        res.render('user/account.hbs', {error: 'Username already exists'})
      }
    })
  }
})

router.post('/account/delete', (req, res, next) => {
  User.findOneAndRemove({_id: req.user._id})
  .then(() => {
   res.redirect('/')
  })
  .catch((err) => {
    next(err)
  })
})

module.exports = router;