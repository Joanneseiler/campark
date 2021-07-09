const router = require("express").Router();

router.get("/", (req, res, next) => {
  // let profilePic = "images/default-avatar.png"
  // if (req.app.locals.isLoggedIn) {
  //    profilePic = req.session.loggedInUser.profilePic
  // }  
  let profilePic

  if (req.app.locals.isLoggedIn) {
    if(req.session.loggedInUser.profilePic == 'images/default-avatar.png') {
        profilePic = "../"+req.session.loggedInUser.profilePic
    } else {
        profilePic = req.session.loggedInUser.profilePic
    }
  } 
  res.render("home/home", {title: "Home", profilePic: profilePic});
});

module.exports = router;