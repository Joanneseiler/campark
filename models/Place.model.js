const mongoose = require("mongoose");

require("./User.model")

const placeSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        //required: true
    },
    longitude: {
        type: Number,
        //required: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true
    },
    userId: {
        ref: "user",
        type: mongoose.Schema.Types.ObjectId
    },
    image: String
});

const Place = mongoose.model("place", placeSchema);

module.exports = Place;
