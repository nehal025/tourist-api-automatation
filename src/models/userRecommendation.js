const mongoose = require('mongoose');

const userRecommendationSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    _1star: String,
    _2star: String,
    _3star: String,
    _4star: String,
    _5star: String,
    recommendation: [String]

}, {
    versionKey: false
});

const userRecommendation = new mongoose.model("userRecommendation", userRecommendationSchema)
module.exports = userRecommendation;