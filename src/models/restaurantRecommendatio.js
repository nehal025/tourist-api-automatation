const mongoose = require('mongoose');

const restaurantsRecommendationSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    recommendation: {
        type: 'array',
        default: null,
        items: { type: 'string', uniqueItems: true }
    }
}, {
    versionKey: false
});

const  restaurantsRecommendation = new mongoose.model("restaurantsRecommendation", restaurantsRecommendationSchema)
module.exports =  restaurantsRecommendation;