//places/add (only post?)
//places/:id
//review (only post)

const router = require("express").Router();
const Place = require("../models/Place.model")

router.get("/places", (req, res, next) => {
    // hier später Inhalt vom API oder Database benutzen:
    // Sending some data to the hbs page
    let loc = [54.80549559002091, 9.4120769896646]
    //Always stringify data that the scripts might use in your hbs file
    res.render("places/map.hbs", {title: "places", loc: JSON.stringify(loc), places: []})
})

router.post("/places/add", (req, res, next) => {
    const {address, description, price, rate} = req.body

    Place.create({address, description, price, rate})
        .then(()=>{
            res.redirect("/places")
        })
        .catch((err)=>{
            console.log(err)
        })
        
})

module.exports = router;