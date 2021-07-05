//places/:id
//review (only post)

const router = require("express").Router();
const Place = require("../models/Place.model")

router.get("/map", async (req, res, next) => {
    // Sending some data to the hbs page
    let loc = [54.80549559002091, 9.4120769896646]
    //Always stringify data that the scripts might use in your hbs file

    res.render(
        "places/map.hbs", 
        {
            title: "Places", 
            loc: JSON.stringify(loc)
        }
    )
})

router.get("/places", async (req, res, next) => {
    const places = await Place.find()
    res.json({places})
});

router.post("/places/add", (req, res, next) => {
    const {address, description, price, rate, latitude, longitude} = req.body

    Place.create({address, description, price, rate, latitude, longitude})
        .then(()=>{
            res.redirect("/map")
        })
        .catch((err)=>{
            next(err)
        })
})


router.get("/places/:id", (req, res, next) => {
    let dynamicPlacesId = req.params.id

    Place.findById(dynamicPlacesId)
        .then((place) => {
            res.render("places/details.hbs", {place: place, ratingStars: "★".repeat(place.rate) + "☆".repeat(5-place.rate)})
        })
        .catch((err)=>{
            next(err)
        })
})

module.exports = router;