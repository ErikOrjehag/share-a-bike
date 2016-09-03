
var router = module.exports = require("express").Router();
var pool = require('../pool');

router.get("/test", function (req, res) {
  res.json({ foo: "bar" });
});

router.get("/user/:id", function (req, res) {
  pool.connect(function(error, client, done) {
    if (error) return console.log(error);

    client.query('SELECT * FROM users WHERE id = $1', [req.params.id], function(error, result) {
      done();

      if (error) return console.log(error);

      res.json(result.rows[0]);
    });
  });
});

router.get("/bike/:id", function (req, res) {
  pool.connect(function(error, client, done) {
    if (error) return console.log(error);
    client.query('SELECT * FROM bikes WHERE id = $1', [req.params.id], function(error, result) {
      done();

      if (error) return console.log(error);

      res.json(result.rows[0]);
    });
  });
});

router.get("/bikes", function (req, res) {
  pool.connect(function(error, client, done) {
    if (error) return console.log(error);

    client.query('SELECT * FROM bikes', function(error, bikes) {
      if (error) return console.log(error);

      client.query('SELECT id, bike_id, ts, ST_X(pos) AS lat, ST_Y(pos) AS lon FROM bike_positions ORDER BY bike_id, ts DESC', function(error, positions) {
        done();

        if (error) return console.log(error);

        var pos = positions.rows.reduce(function (prev, position) {
          var bike_id = position.bike_id;
          if (!prev[bike_id]) {
            prev[bike_id] = [];
          }
          prev[bike_id].push(position);
          return prev;
        }, {});

        var result = bikes.rows.map(function (bike) {
          bike["positions"] = pos[bike.id];
          return bike;
        });

        res.json(result);
      });
    });
  });
});
