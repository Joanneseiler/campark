const router = require("express").Router();

router.get("/", (req, res, next) => {
  let profilePic = "images/default-avatar.png"
  if (req.app.locals.isLoggedIn) {
     profilePic = req.user.profilePic
  }
  res.render("home/home", {title: "Home", profilePic});
});

module.exports = router;