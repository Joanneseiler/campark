const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.render("home/home", {title: "Home"});
});

module.exports = router;