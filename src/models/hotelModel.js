const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	img: String,
	location: String,
	info:String,
	star: String,
	rating: Number,
	reviews:String,
	price: String,
	booknow:String
}, {
	versionKey: false 
});


const Hotel = new mongoose.model("Hotel", HotelSchema)
module.exports = Hotel;
