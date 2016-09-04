
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
    client.query('SELECT bikes.id, bikes.bike_name, bikes.image_url, bikes.owner, bikes.electron_id, bikes.locked, bikes.moved, bikes.online, bikes.rented_by, users.full_name, users.rating FROM bikes LEFT JOIN users ON bikes.owner = users.id WHERE bikes.id = $1 ORDER BY bikes.id DESC', [req.params.id], function(error, bikes) {
      done();

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

        res.json(result[0]);
      });
    });
  });
});

router.get("/bikes", function (req, res) {
  pool.connect(function(error, client, done) {
    if (error) return console.log(error);

    client.query('SELECT bikes.id, bikes.bike_name, bikes.image_url, bikes.owner, bikes.electron_id, bikes.locked, bikes.moved, bikes.online, bikes.rented_by, users.full_name, users.rating, bu.full_name AS rented_by_full_name, bu.rating AS rented_by_rating FROM bikes LEFT JOIN users ON bikes.owner = users.id LEFT JOIN users AS bu ON bikes.rented_by = bu.id ORDER BY bikes.id DESC', function(error, bikes) {
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

router.get("/bikeBorrowing/:userId", function (req, res) {
  pool.connect(function (error, client, done) {
    if (error) return console.log(error);

    client.query('SELECT id FROM bikes WHERE rented_by = $1', [req.params.userId], function (error, result) {
      done();

      if (error) return console.log(error);

      if (result.rows.length) {
        res.json(result.rows[0].id);
      } else {
        res.json(false);
      }
    });
  })
});