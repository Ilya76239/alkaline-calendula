const request = require("request-promise");
const MongoClient = require("mongodb");
const CONNECTION_STRING = process.env.DB;

function StockHandler() {
  this.fetchStockData = async function(stock) {
    const options = {
      uri: `https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`,
      json: true
    };
    return request(options).then(body => {
      return { stock: body.symbol, price: body.latestPrice };
    });
  };

  this.handleLikes = async function(stock, ip, like) {
    //add like if one is passed
    const db = await MongoClient.connect(CONNECTION_STRING);
    const collection = db.collection("stockLikes");

    if (like) {
      await collection
        .findOneAndUpdate(
          { stock: stock, ip: ip },
          { $setOnInsert: { stock: stock, ip: ip } },
          { upsert: true, returnOriginal: false }
        )
        .then(result => result)
        .catch(err => console.log(err));
    }

    let count = await collection
      .count({ stock: stock })
      .then(result => result)
      .catch(err => console.log(err));
    db.close();
    return count;
  };
}

module.exports = StockHandler;

// MongoClient.connect(CONNECTION_STRING, function(err, db) {
//   let collection = db.collection("stockLikes");
//   collection
//     .findOneAndUpdate(
//       { stock: stock, ip: ip },
//       { $setOnInsert: { stock: stock, ip: ip } },
//       { upsert: true }
//     )
//     .then(function(r) {
//       return r;
//       // Finish up test
//       db.close();
//     });
// });
