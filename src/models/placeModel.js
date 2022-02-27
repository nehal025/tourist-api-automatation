const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	img: [String],
	location:String,
	state:String,
	info: String,
	featured:Boolean,
	ml:Boolean

}, {
	versionKey: false 
});

const place = new mongoose.model("place", placeSchema)
module.exports = place;