const mongoose = require("mongoose")

require("./User.model")

const PlaceSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        ref: "user",
        type: mongoose.Schema.Types.ObjectId
    },
    image: String
})