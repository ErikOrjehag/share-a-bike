
var router = module.exports = require("express").Router();
var pg = require('pg');

// Setup database configuration.

var config = {
  user: 'postgres',
  database: 'bike',
  password: '123',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

pool.on('error', function (error, client) {
  console.error('idle client error', error.message, error.stack)
});


// API endpoints.

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