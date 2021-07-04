const router = require("express").Router();
const User = require('../models/User.model');
const Places = require('../models/Place.model');


router.get('/profile', (req, res, next) => {
    if (!req.user) {
        res.redirect('/signin'); // can't access the page, so go and log in
        return;
      }
     
      // ok, req.user is defined
      req.app.locals.isLoggedIn = true;
      
    //   PlaceModel.find()
    //   .populate('userId')
    //   .then((places) => {
    //       res.send(places)
    //   })
    //   .catch((err) => {
    //       next(err)
    //   })


      res.render('user/profile', {title: req.user.username, username:  req.user.username, country: req.user.country});
      // , image: req.user.profilePic, placesVisited: req.user.placesVisited, placesAdded: req.user.placesAdded
})


module.exports = router;