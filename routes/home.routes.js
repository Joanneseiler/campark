const router = require("express").Router();

router.get("/", (req, res, next) => {

  // let profilePic = "images/default-avatar.png"
  // if (req.app.locals.isLoggedIn) {
  //    profilePic = req.session.loggedInUser.profilePic
  // }  
  res.render("home/home", {title: "Home"});
});

module.exports = router;