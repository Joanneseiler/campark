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
            // profilePic: req.session.loggedInUser != null ? req.session.loggedInUser.profilePic : null,
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
    const user = req.session.loggedInUser._id

    //I thought this could be a solution fot the errors but is rerendering the page
    // if ( !address || !description || !price || !rate) { 
    //     res.render('places/map', {error: 'Please enter all fields', address, description, price, rate})
    // return
    // }

    Place.create({address, description, price, rate, latitude, longitude, authorId: user, image: image})
    .then((place) => {
        console.log(place)
        User.findByIdAndUpdate({_id: user}, { $push: { placesAdded: place._id, placesVisited: place._id  } })
        .then(() => {
        res.redirect(`/map?lon=${place.longitude}&lat=${place.latitude}`)  
       })
    })
    .catch((err)=>{
        next(err)
    })
})

router.get("/places/:placeId", (req, res, next) => {
    let dynamicPlacesId = req.params.placeId
    let profilePic = "../images/default-avatar.png"
    

    //this route it's trying to pick the photo in the folder /places and not in the folder /images. Because of it, I needed to use the ../. I found the solution here but I still without understand why it's happening (https://laracasts.com/discuss/channels/laravel/route-parameters-causing-wrong-urls-for-static-images-and-ajax-requests-l-54)
    if (req.app.locals.isLoggedIn) {
        if(req.session.loggedInUser.profilePic == 'images/default-avatar.png') {
            profilePic = "../"+req.session.loggedInUser.profilePic
        } else {
            profilePic = req.session.loggedInUser.profilePic
        }
    }

    Place.findById(dynamicPlacesId)
        .populate('reviews')
        .then((place) => {
            Review.find({placeId: dynamicPlacesId})
            .populate("userId")
            .then((reviews) => {
                place.reviews = reviews;
                res.render("places/details", {place: place, ratingStars: "★".repeat(place.rate) + "☆".repeat(5-place.rate), profilePic: profilePic})
            })
        })
        .catch((err)=>{
            next(err)
        })
})

router.post("/places/:placeId/review", (req, res, next) => {
    const placeId = req.params.placeId
    const {rate, date, comment} = req.body
    const user = req.session.loggedInUser._id
    const dateNow = new Date
    let day = dateNow.getDate();
    let month = dateNow.getMonth() + 1;
    let year = dateNow.getFullYear();
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    let dateFormated = day + '/' + month + '/' + year;

    Review.create({rate, date: dateFormated, comment, userId: user, placeId: placeId})
    .then((review)=> {
        return Place.findByIdAndUpdate({_id: placeId}, { $push: { reviews: review._id}})
    })
    .then((placeUpdated) => {
         User.findById({_id: user})
         .then((userUnique) => {
            let alreadyVisited = false
            userUnique.placesVisited.forEach((placeReviewed) => {
  
                if (placeId == placeReviewed) {
                    alreadyVisited = true
                }
            })
            if(!alreadyVisited) {  
              User.findByIdAndUpdate({_id: user}, {$push: {placesVisited: placeUpdated._id}})
                .then(() => {
                    res.redirect(`/places/${placeId}`)
                })
            }
            else {
                res.redirect(`/places/${placeId}`)
            }
         })
    })
    .catch((err)=>{
        next(err)
    })
})

module.exports = router;


