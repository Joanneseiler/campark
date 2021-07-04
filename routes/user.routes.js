const router = require('express').Router();
const User = require('../models/User.model');
const Places = require('../models/Place.model');
const Reviews = require('../models/Review.model');


router.get('/profile', (req, res, next) => {
    if (!req.user) {
        res.redirect('/signin'); // can't access the page, so go and log in
        return;
      }
      // ok, req.user is defined
      req.app.locals.isLoggedIn = true;
      
      Places.find({'authorId.id': req.user._id})
      .then((placesAdded) => {
        Reviews.find({'userId.id': req.user._id})
        .then ((placesVisited) => {
          res.render('user/profile', {title: req.user.username, username: req.user.username, country: req.user.country, image: req.user.profilePic, placesAdded: placesAdded, placesVisited: placesVisited});
        })
      })
      .catch((err) => {
          next(err)
      })
})

module.exports = router;