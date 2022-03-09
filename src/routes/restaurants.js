//restarurnt api
const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restarurantModel');
const restarurantScrapper = require("../Scrappers/RestaurantScrapper/restarurantScrapper");

// Get all restarurnt
router.get('/', async (req, res) => {

	let location = req.query.location;

	var query = {};

	if (location) {
		query["location"] = location;
	}

	const q = await Restaurant.find(query);

	console.log("Req from client")

	res.json(q)

});

// Get live restarurnt
router.get('/live', async (req, res) => {

	let location = req.query.location;
	if (location) {


		restarurantScrapper(location).then(dataObj => {
			res.send(dataObj);
		}).catch(console.error)

	} else {
		res.send("Please give location")
	}

});
router.post('/live', async (req, res) => {

	let location = req.query.location;
	let category = req.body.category;
	if (location) {

		if (category.length === 0) {
			
			restarurantScrapper(location).then(dataObj => {
				res.send(dataObj);
			}).catch(console.error)

		} else {

			restarurantScrapper(location, category).then(dataObj => {
				res.send(dataObj);
			}).catch(console.error)
		}

	} else {
		res.send("Please give location")
	}

});


// Create new restarurnt
router.post('/', async (req, res) => {

	const newRestaurant = new Restaurant(req.body);
	const savedRestaurant = await newRestaurant.save();
	res.json(savedRestaurant);

});

module.exports = router;