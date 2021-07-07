const router = require("express").Router();
const Place = require("../models/Place.model")
const User = require("../models/User.model")
const Review = require("../models/Review.model")
const uploader = require('../config/cloudinary.config.js');

router.get("/map", async (req, res, next) => {
    // Sending some data to the hbs page
    let loc = [50.45458412526528, 10.98668760118]
    let zoomLevel = 5
    //Always stringify data that the scripts might use in your hbs file
    if (req.query.lon !== undefined && req.query.lat !== undefined) {
        loc = [parseFloat(req.query.lat), parseFloat(req.query.lon)]
        zoomLevel = 13
    }
    res.render(
        "places/map.hbs", 
        {
            title: "Places", 
            loc: JSON.stringify(loc), 
            profilePic: req.user != null ? req.user.profilePic : null,
            zoomLevel
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
    let image
    if (!req.file || !req.file.path){
        image = '/images/default-image.jpeg'
    }
    else {
        image = req.file.path
    }
    const user = req.user._id
    Place.create({address, description, price, rate, latitude, longitude, authorId: user, image: image})
    .then((place) => {
        User.findByIdAndUpdate({_id: user}, { $push: { placesAdded: place._id } })
        return place;
    })
    .then((place)=>{
        res.redirect(`/map?lon=${place.longitude}&lat=${place.latitude}`)
    })
    .catch((err)=>{
        next(err)
    })
})

router.get("/places/:placeId", (req, res, next) => {
    let dynamicPlacesId = req.params.placeId
    let profilePic = "/images/default-avatar.png"
    if (req.app.locals.isLoggedIn) {
       profilePic = req.user.profilePic
    }
    console.log(dynamicPlacesId)
    Place.findById(dynamicPlacesId)
        .populate('reviews')
        .then((place) => {
            res.render("places/details.hbs", {place: place, ratingStars: "★".repeat(place.rate) + "☆".repeat(5-place.rate), profilePic})
        })
        .catch((err)=>{
            next(err)
        })
})

router.post("/places/:placeId/review", (req, res, next) => {
    const placeId = req.params.placeId //this gets the dynamically id after the :
    const {rate, date, comment} = req.body
    const user = req.user._id

    Review.create({rate, date, comment, userId: user})
    .then((review)=> {
        return Place.findByIdAndUpdate({_id: placeId}, { $push: { reviews: review._id}})
    })
    .then((placeUpdated) => {
         User.findByIdAndUpdate({_id: user}, { $push: { placesVisited: placeUpdated._id }})
         .then(() => {
            res.redirect(`/places/${placeId}`)
         })
    })
    .catch((err)=>{
        console.log(err)
    })
})

module.exports = router;
