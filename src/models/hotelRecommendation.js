const mongoose = require('mongoose');

const hotelRecommendationSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    _1star: {
        type: String,
        default: "0",

    },
    _2star: {
        type: String,
        default: "0",

    },
    _3star: {
        type: String,
        default: "0",

    },
    _4star: {
        type: String,
        default: "0",

    },
    _5star: {
        type: String,
        default: "0",

    },
    recommendation: {
        type: 'array',
        items: { type: 'string', uniqueItems: true }
    }

}, {
    versionKey: false
});

const hotelRecommendation = new mongoose.model("hotelRecommendation", hotelRecommendationSchema)
module.exports = hotelRecommendation;