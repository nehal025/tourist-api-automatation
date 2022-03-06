const express = require('express');
const router = express.Router();
const Hotel = require('../models/hotelModel');
const hotelScrapper = require("../Scrappers/HotelSrapper/hotelScrapper");

// Get all Hotels
router.get('/', async (req, res) => {
	const { star, location } = req.query

	var query = {};

	try {
		if (location) {
			query["location"] = location;
	
		}
		if (star) {
			query["star"]={ "$in":star }; 
	
		}

		const q = await Hotel.find(query);
		console.log("Req from client")
		res.send(q)
		
	} catch (error) {
		
	}



});

// Get live Hotels via scrapping
router.get('/live', async (req, res) => {

	const { star, location } = req.query


	if(location){
		hotelScrapper(location,star).then(dataObj => {

		
			res.send(dataObj);
		}).catch(console.error)
		
	
	
	}else{
		res.send("pls give location");
	}

});




// Create new Hotel
router.post('/', async (req, res) => {
	const newHotel = new Hotel(req.body);
	const savedHotel = await newHotel.save();
	res.json(savedHotel);
});

module.exports = router;