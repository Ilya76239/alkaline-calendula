/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const expect = require("chai").expect;
const StockHandler = require("../controllers/stockHandler.js");

module.exports = function(app) {
  //load controller
  const stockPrices = new StockHandler();

  app.route("/api/stock-prices").get(async function(req, res, next) {
    const stock = req.query.stock;
    const like = req.query.like || false;
    const reqIp = req.connection.remoteAddress;

    let data = { stockData: null };
    //check if two stocks passed in and excute correct code
    if (Array.isArray(stock)) {
      const stockArray = [
        await stockPrices.fetchStockData(stock[0]),
        await stockPrices.fetchStockData(stock[1])
      ];
      //load stocks into json response
      data.stockData = stockArray;
      //load likes for stocks
      let likes = [
        await stockPrices.handleLikes(data.stockData[0].stock, reqIp, like),
        await stockPrices.handleLikes(data.stockData[1].stock, reqIp, like)
      ];
      //insert relative likes in reponse array
      data.stockData[0].rel_likes = likes[0] - likes[1];
      data.stockData[1].rel_likes = likes[1] - likes[0];
    } else {
      //load one stock
      data.stockData = await stockPrices.fetchStockData(stock);
      data.stockData.likes = await stockPrices.handleLikes(
        data.stockData.stock,
        reqIp,
        like
      );
    }
    //send response
    res.json(data);
  });
};
