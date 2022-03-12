
const Hotel = require("../../../models/hotelModel");

const upsertHotels = dataObj => {
  try {

    Hotel.find({}, function (err, newsList) {
      return newsList;
    }).clone()
      .then(newsList => {

        if (newsList == "") {
          console.log("A new Hotel data was created");
          const q = dataObj.map(x => new Hotel(x).save());
          return q;
        } else {

          console.log("updating Hotel database...");
          dataObj.map(x => {

            Hotel.updateOne(
              { title: x.title },
              [{ $set: { title: x.title, img: x.img, location: x.location, info: x.info, star: x.star,rating:x.rating, reviews: x.reviews, price: x.price, booknow: x.booknow } }],
              { upsert: true }
            ).exec()

          }
          )
        }
      }).catch(err => console.log(err));

  } catch (err) {
    console.error(err);
  }
};

module.exports = upsertHotels;