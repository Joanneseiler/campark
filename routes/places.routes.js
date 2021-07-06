//places/:id
//review (only post)

const router = require("express").Router();
const Place = require("../models/Place.model")
const User = require("../models/User.model")
const uploader = require('../config/cloudinary.config.js');

router.get("/map", async (req, res, next) => {
    // Sending some data to the hbs page
    let loc = [54.80549559002091, 9.4120769896646]
    //Always stringify data that the scripts might use in your hbs file

    res.render(
        "places/map.hbs", 
        {
            title: "Places", 
            loc: JSON.stringify(loc), 
            profilePic: req.user.profilePic
        }
    )
})

router.get("/places", async (req, res, next) => {
    const places = await Place.find()
    res.json({places})
});

router.post("/places/add", uploader.single("image"), (req, res, next) => {
        // // the uploader.single() callback will send the file to cloudinary and get you and obj with the url in return
        // console.log('file is: ', req.file)
        // if (!req.file) {
        //   console.log("there was an error uploading the file")
        //   next(new Error('No file uploaded!'));
        //   return;
        // }
        
    const {address, description, price, rate, latitude, longitude,} = req.body
    const image = req.file.path
    if (!req.file.path){
        image = '/images/default-image.jpeg'
    }
    const user = req.user._id
    Place.create({address, description, price, rate, latitude, longitude, authorId: user, image: image})
    .then((place) => {
        return User.findByIdAndUpdate({_id: user}, { $push: { placesAdded: place._id } })
        })
        .then(()=>{
            res.redirect("/map")
        })

        .catch((err)=>{
            next(err)
        })
})


router.get("/places/:id", (req, res, next) => {
    let dynamicPlacesId = req.params.id
    let profilePic = "images/default-avatar.png"
    if (req.app.locals.isLoggedIn) {
       profilePic = req.user.profilePic
    }
    Place.findById(dynamicPlacesId)
        .then((place) => {
            res.render("places/details.hbs", {place: place, ratingStars: "★".repeat(place.rate) + "☆".repeat(5-place.rate), profilePic})
        })
        .catch((err)=>{
            next(err)
        })
})

module.exports = router;