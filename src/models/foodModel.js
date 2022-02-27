//food dishes model 
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	img: [String],
	info: String,
	state:String,
	featured:Boolean,
	ml:Boolean
},{
	versionKey: false 
});

const food = new mongoose.model("food", foodSchema)
module.exports = food;