//food api
const express = require('express');
const router = express.Router();
const Food = require('../models/foodModel');


// Get all Food
router.get('/', async (req, res) => {

	const { name, state } = req.query

	var query = {};
	
	if (name) {
		query["name"] = name;
		console.log(name)

	}
	if (state) {
		query["state"] = state;
	}
	const output = await Food.find(query);
	res.json(output)

});

// Create new Food
router.post('/', async (req, res) => {

	const newFood = new Food(req.body);
	const savedFood = await newFood.save();
	res.json(savedFood);

});

module.exports = router;