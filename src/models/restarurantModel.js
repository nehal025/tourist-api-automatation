const mongoose = require('mongoose');

const RestarurantSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	img: String,
	location: String,
	info:String,
	rating:Number,
	bookNow:String
}, {
	versionKey: false 
});

const Restarurant = new mongoose.model("Restarurant", RestarurantSchema)
module.exports = Restarurant;
