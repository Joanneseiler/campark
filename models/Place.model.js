const { Schema, model } = require("mongoose");

require("./User.model")
require("./Review.model")

const placeSchema = new Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
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
    authorId: {
        ref: "user",
        type: Schema.Types.ObjectId
    },
    image: {
       type: String,
        default: '/images/default-image.jpeg'
    },
    reviews: [{ 
        type: Schema.Types.ObjectId, 
        ref: "review" 
    }]
});

const Place = model("place", placeSchema);

module.exports = Place;


