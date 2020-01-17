/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("GET /api/stock-prices => stockData object", function() {
    let likes,
      rel_likes = 0;
    test("1 stock", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "stockData");
          assert.property(res.body.stockData, "stock");
          assert.property(res.body.stockData, "price");
          assert.property(res.body.stockData, "likes");
          assert.equal(res.body.stockData.stock, "GOOG");
          done();
        });
    });

    test("1 stock with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog", like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "stockData");
          assert.property(res.body.stockData, "stock");
          assert.property(res.body.stockData, "price");
          assert.property(res.body.stockData, "likes");
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.isAtLeast(res.body.stockData.likes, 1);
          likes = res.body.stockData.likes;
          done();
        });
    });

    test("1 stock with like again (ensure likes arent double counted)", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog", like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "stockData");
          assert.property(res.body.stockData, "stock");
          assert.property(res.body.stockData, "price");
          assert.property(res.body.stockData, "likes");
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.equal(res.body.stockData.likes, likes);
          done();
        });
    });

    test("2 stocks", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["goog", "msft"] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "stockData");
          assert.isArray(res.body.stockData, "stockData should be an array");
          assert.equal(res.body.stockData.length, 2);
          assert.property(res.body.stockData[0], "stock");
          assert.property(res.body.stockData[0], "price");
          assert.property(res.body.stockData[0], "rel_likes");
          assert.equal(res.body.stockData[0].stock, "GOOG");
          assert.property(res.body.stockData[1], "stock");
          assert.property(res.body.stockData[1], "price");
          assert.property(res.body.stockData[1], "rel_likes");
          assert.equal(res.body.stockData[1].stock, "MSFT");
          assert.equal(
            res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes,
            0
          );
          rel_likes = Math.abs(res.body.stockData[0].rel_likes);
          done();
        });
    }).timeout(5000);

    test("2 stocks with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["goog", "msft"], like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "stockData");
          assert.isArray(res.body.stockData, "stockData should be an array");
          assert.equal(res.body.stockData.length, 2);
          assert.property(res.body.stockData[0], "stock");
          assert.property(res.body.stockData[0], "price");
          assert.property(res.body.stockData[0], "rel_likes");
          assert.equal(res.body.stockData[0].stock, "GOOG");
          assert.property(res.body.stockData[1], "stock");
          assert.property(res.body.stockData[1], "price");
          assert.property(res.body.stockData[1], "rel_likes");
          assert.equal(res.body.stockData[1].stock, "MSFT");
          assert.equal(
            res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes,
            0
          );
          assert.equal(Math.abs(res.body.stockData[0].rel_likes), rel_likes);
          done();
        });
    }).timeout(5000);
  });
});
