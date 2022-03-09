const mongoose = require('mongoose');

const usersRestaurantsRecSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    recommendation: [String],

}, {
    versionKey: false
});

const usersRestaurantsRec = new mongoose.model("usersRestaurantsRec", usersRestaurantsRecSchema)
module.exports = usersRestaurantsRec;