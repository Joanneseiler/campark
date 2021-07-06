const router = require("express").Router();
const Place = require("../models/Place.model")
const User = require("../models/User.model")
const Review = require("../models/Review.model")

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

    Place.findById(dynamicPlacesId)
        .then((place) => {
            res.render("places/details.hbs", {place: place, ratingStars: "★".repeat(place.rate) + "☆".repeat(5-place.rate)})
        })
        .catch((err)=>{
            next(err)
        })
})


router.post("/review", (req, res, next) => {
    const {rate, date, comment} = req.body
    const user = req.user._id

Review.create({rate, date, comment, userId: user})
    .then((review)=> {
        return User.findByIdAndUpdate({_id: user}, { $push: { reviewsAdded: review._id }})
    })
    .then(() => {
        res.redirect("/map")
    })
    .catch((err)=>{
        console.log(err)
     })

// WE TRIED THIS BUT ITS NOT WORKING
// router.post("/places/:placeId/review", (req, res, next) => {
//     const {placeId} = req.params
//     const {rate, date, comment} = req.body
//     const user = req.user._id

//     Review.create({rate, date, comment, userId: user})
//         .then((review)=> {
//             return User.findByIdAndUpdate({_id: user}, { $push: { reviewsAdded: review._id }})
//         })
//         .then(()=>{
//             return Place.findById({_id: placeId})
//         })
//         .then((place)=>{
//             return User.findByIdAndUpdate({_id: user}, { $push: { placesVisited: place._id }})
//         })
//         .then(() => {
//             res.redirect("/places/{place._id}")
//         })
//         .catch((err)=>{
//             console.log(err)
//         })
})

module.exports = router;