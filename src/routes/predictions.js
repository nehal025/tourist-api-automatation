const express = require("express");
const router = express.Router();


const tf = require("@tensorflow/tfjs-node");

const priceHotelScrapper = require("../helpers/Scrappers/HotelSrapper/priceHotelScrapper");
const flightScrapper = require("../helpers/Scrappers/flightScrapper");
const trainScrapper = require("../helpers/Scrappers/trainScrapper");


router.get("/", async (req, res) => {

    const { day, person, star, fromCity, toCity, flightBool, trainBool } = req.query;

    var hotels;
    var flight;
    var train;

    var hotelCostSum = 0;
    var flightCostSum = 0;
    var trainCostSum = 0;

    var hotelsAvgCost = 0;
    var flightAvgCost = 0;
    var trainAvgCost = 0;

    var hotelCount = 0;
    var flightCount = 0;
    var trainCount = 0;


    const model = await tf.loadLayersModel("file://src/ml/model.json");
    inputTensor = tf.tensor([[parseInt(day), parseInt(person)]]);
    mlOutput = model.predict(inputTensor);
    var livingCost = parseInt(mlOutput.dataSync()[0]);


    try {
        const hotelOutput = priceHotelScrapper(toCity, star)
            .then((dataObj) => {
                hotels = dataObj;

                dataObj.map((value) => {
                    hotelCostSum = hotelCostSum + value.price;
                    hotelCount++;
                });
            })
            .catch(console.error);



        if (flightBool) {

            var flightOutput = flightScrapper(fromCity + " india", toCity + " india")
                .then((dataObj) => {
                    flight = dataObj;

                    dataObj.map((value) => {
                        flightCostSum = flightCostSum + value.cost;
                        flightCount++;
                    });
                })
                .catch(console.error);


        }

        if (trainBool) {

            var trainOutput = trainScrapper(fromCity, toCity)
                .then((dataObj) => {
                    train = dataObj;

                    dataObj.map((value) => {
                        trainCostSum = trainCostSum + value.cost;
                        trainCount++;
                    });
                })
                .catch(console.error);

        }

        if (flightBool) {
            Promise.all([hotelOutput, flightOutput, mlOutput]).then((values) => {

                hotelsAvgCost = parseInt(hotelCostSum / hotelCount);
                flightAvgCost = parseInt(flightCostSum / flightCount);

                let totalCost = livingCost + hotelsAvgCost + flightAvgCost;

                res.json({
                    day,
                    person,
                    totalCost,
                    livingCost,
                    hotelsAvgCost,
                    hotels,
                    flightAvgCost,
                    flight,
                });



            });
        }

        if (trainBool) {

            Promise.all([hotelOutput, trainOutput, mlOutput]).then((values) => {

                hotelsAvgCost = parseInt(hotelCostSum / hotelCount);
                trainAvgCost = parseInt(trainCostSum / trainCount);

                let totalCost = livingCost + hotelsAvgCost + trainAvgCost;

                res.json({
                    day,
                    person,
                    totalCost,
                    livingCost,
                    hotelsAvgCost,
                    hotels,
                    trainAvgCost,
                    train,
                });

            });
        }


    } catch (error) {


    }











});


module.exports = router;
