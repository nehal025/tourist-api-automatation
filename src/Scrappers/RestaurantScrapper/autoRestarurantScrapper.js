const restarurantScrapper = require("./restarurantScrapper");
const upsertRestarurant = require("./upsertRestarurants");

let RestarurantLocation = [];
var i = 0;                 

function iterateLocations() {

  setTimeout(function () {

    console.log(i);

    restarurantScrapper(RestarurantLocation[i])
      .then(dataObj => {
        upsertRestarurant(dataObj);
      }).catch(console.error)

    i++;

    if (i < RestarurantLocation.length) {
      iterateLocations();
    }
  }, 10000);

}

const autoRestarurantScrapper = () => {

    //Running Restarurant webScrapper every minute
    console.log('Running Restarurant webScrapper every minute');
    RestarurantLocation.push('mumbai')
    RestarurantLocation.push('pune')
    iterateLocations();  
    
};

module.exports = autoRestarurantScrapper;
