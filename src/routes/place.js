const express = require('express');
const router = express.Router();
const Place = require('../models/placeModel');
const placeScrapper = require("../Scrappers/placeScrapper");

// Get all place
router.get('/', async (req, res) => {
	const { name, location, featured, state, ml } = req.query

	var query = {};

	if (name) {
		query["name"] = name;
		console.log(name)
	}
	if (location) {
		query["location"] = location;
	}
	if (featured) {
		query["featured"] = featured;
	}
	if (state) {
		query["state"] = state;
	}
	if (ml) {
		query["ml"] = ml;
	}
	const q = await Place.find(query);
	console.log("Req from client")
	res.json(q)

});

router.get('/live', async (req, res) => {

	let location = req.query.location;

	if (location) {

		placeScrapper(location).then(dataObj => {
			res.send(dataObj);
		}).catch(console.error)

	} else {
		res.send("Please give location")
	}

});

// Create new place
router.post('/', async (req, res) => {

	const newPlace = new Place(req.body);
	const savedPlace = await newPlace.save();
	res.json(savedPlace);

});


module.exports = router;
