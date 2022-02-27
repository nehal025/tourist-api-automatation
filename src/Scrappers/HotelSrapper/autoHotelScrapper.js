const hotelScrapper = require("./hotelScrapper");
const upsertHotels = require("./upsertHotels");

let HotelLocation = [];
var i = 0;

function iterateLocations() {

  setTimeout(function () {

    console.log(i);

    hotelScrapper(HotelLocation[i])
      .then(dataObj => {
        upsertHotels(dataObj);
      }).catch(console.error)

    i++;

    if (i < HotelLocation.length) {
      iterateLocations();
    }
  }, 20000);

}

const autoHotelScrapper = () => {
  
  //Running Hotels webScrapper every minute
  console.log('Running Hotels webScrapper every minute');
  HotelLocation.push('mumabi')
  HotelLocation.push('pune')
  iterateLocations();

};

module.exports = autoHotelScrapper;
