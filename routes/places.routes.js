//places/add (only post?)
//places/:id
//review (only post)

const router = require("express").Router();
const Place = require("../models/Place.model")
const User = require("../models/User.model")

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
    const user = req.user._id
    Place.create({address, description, price, rate, latitude, longitude, authorId: user})
    .then((place) => {
        console.log(place)
        return User.findByIdAndUpdate({_id: user}, { $push: { placesAdded: place._id } })
        })
        .then(()=>{
            res.redirect("/map")
        })

        .catch((err)=>{
            console.log(err)
        })    
})

module.exports = router;