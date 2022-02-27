const express = require('express');
const router = express.Router();
// const tf = require('@tensorflow/tfjs');
const tf= require('@tensorflow/tfjs-node');
const priceHotelScrapper = require("../Scrappers/HotelSrapper/priceHotelScrapper");

router.get('/', async (req, res) => {

    const { day, person, star, location } = req.query

    var hotels;
    var travelOptions = {}
    var sum = 0;
    var hotelsAvgCost = 0;
    var travelAvgCost = 0;
    var count = 0;

    const op = priceHotelScrapper(location, star).then(dataObj => {
        hotels = dataObj

        dataObj.map(value => {
            sum = sum + value.price;
            count++;
        });


    }).catch(console.error)


    const model = await tf.loadLayersModel('file://src/ml/model.json');
    inputTensor = tf.tensor([[parseInt(day), parseInt(person)]])
    output = model.predict(inputTensor)
    var livingCost = parseInt(output.dataSync()[0])


    Promise.all([op, output]).then((values) => {
        hotelsAvgCost = parseInt(sum / count);
        let totalCost = livingCost + hotelsAvgCost  +travelAvgCost
       

        res.json({ day, person, totalCost, livingCost, hotelsAvgCost, hotels, travelAvgCost, travelOptions })
    });

});

module.exports = router;