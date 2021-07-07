const router = require("express").Router();

router.get("/", (req, res, next) => {

  let profilePic = "images/default-avatar.png"
  console.log("home " + req.user)
  if (req.app.locals.isLoggedIn && !req.user === null && !req.user.profilePic === null) {
     profilePic = req.user.profilePic
  }
  
  res.render("home/home", {title: "Home", profilePic});
});

module.exports = router;