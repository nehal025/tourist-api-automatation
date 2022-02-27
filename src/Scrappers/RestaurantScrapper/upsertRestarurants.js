//upsert restarunt
const Restarurant = require("../../models/restarurantModel");

const upsertRestarurants = dataObj => {
  try {
    
    Restarurant.find({}, function (err, newsList) {
      return newsList;
    }).clone()
      .then(newsList => {

        if (newsList == "") {
          console.log("A new data was created restarurant");
          const q = dataObj.map(x => new Restarurant(x).save());
          return q;
        } else {

          console.log("updating restarurant database...");
          dataObj.map(x => {

            Restarurant.updateOne(
              { title: x.title },
              [{ $set: { title: x.title, img: x.img,location: x.location, info:x.info, rating:x.rating,booknow: x.booknow }}],
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

module.exports = upsertRestarurants;