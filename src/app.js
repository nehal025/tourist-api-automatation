require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const request = require('request');

const cron = require('node-cron');
const autoHotelScrapper = require("./Scrappers/HotelSrapper/autoHotelScrapper");
const autoRestarurantScrapper = require("./Scrappers/RestaurantScrapper/autoRestarurantScrapper");


var port = process.env.PORT || 3000;

// Create express app
const app = express();


// Database
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true

})
	.then(() => {
		console.log("Connected to MongoDB database...");
	})
	.catch((e) => {
		console.log("Connection falied...")
	});


// Middleware
app.use(express.json());


// Routes
app.get('/', (req, res) => {
	res.send("Hello,from server");
});

const place = require('./routes/place');
app.use('/places', place);

const food = require('./routes/food');
app.use('/food', food);

const hotels = require('./routes/hotels');
app.use('/hotels', hotels);

const restaurants = require('./routes/restaurants');
app.use('/restaurants', restaurants);

const users = require('./routes/users');
app.use('/users', users);

const predictions = require('./routes/predictions');
app.use('/predictions', predictions);

const adminRouter = require('./routes/admin.router');
app.use('/admin', adminRouter);

// Starting server
app.listen(port, console.log(`Listening on port ${port}`));


//Running Hotels webScrapper every minute
// cron.schedule('* * * * *', function () {
// 	autoHotelScrapper();
// });


//Running Restarurant webScrapper every minute
// cron.schedule('* * * * *', function () {
// 	autoRestarurantScrapper();
// });





// Preventing server from down
const ping = () => request('https://smart-tourist-app.herokuapp.com', (error, response, body) => {

	console.log('Preventing server from down')
	console.log('error:', error);
	console.log('statusCode:', response && response.statusCode);
	console.log('body:', body);

});


cron.schedule('*/20 * * * *', function () {
	
	var today = new Date();
	var time = today.getHours();

	if (time < 19 && time > 3) {
		ping();
	}

});


