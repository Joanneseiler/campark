//places
//places/add (only post or get and post?)
//places/:id
//review (only post)

const router = require("express").Router();

router.get("/places", (req, res, next) => {
    // hier später Inhalt vom API oder Database benutzen:
    // Sending some data to the hbs page
    let loc = [54.80549559002091, 9.4120769896646]
    //Always stringify data that the scripts might use in your hbs file
    res.render("places/map.hbs", {loc: JSON.stringify(loc), places: []})
})

module.exports = router;