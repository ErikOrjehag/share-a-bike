
var router = module.exports = require("express").Router();
var pool = require('../pool');
var Particle = require('particle-api-js');
var particle = new Particle();
var request = require('request');


router.get("/bike/:id/rent/:user", function (req, res) {
  var bike_id = req.params.id;
  var user_id = req.params.user;

  pool.connect(function(error, client, done) {
    if (error) return console.log(error);
    client.query('SELECT rented_by FROM bikes WHERE id = $1', [bike_id], function(error, result) {
      done();
      if (error) return console.log(error);
      
      if(result.rows[0].rented_by !== null){
        console.log("User #" +user_id+ " can't rent a bike that is already rent by user #" + result.rows[0].rented_by);
        res.json(false);
      } else {
        client.query("UPDATE bikes SET rented_by = $1 WHERE id = $2", [user_id, bike_id], function(error, result) {
          done();
          if (error) return console.log(error);
          console.log("Bike " + bike_id + " was rented by " + user_id);
          res.json(true);
        });
      }
    });
  });
});

router.get("/bike/:id/return/:user", function (req, res) {
  var bike_id = req.params.id;
  var user_id = req.params.user;

  pool.connect(function(error, client, done) {
    if (error) return console.log(error);
    client.query('SELECT rented_by FROM bikes WHERE id = $1', [bike_id], function(error, result) {
      done();
      if (error) return console.log(error);
      
      if(result.rows[0].rented_by != user_id){
        console.log("User #"+user_id+" can't return a bike that was rented by user #" + result.rows[0].rented_by);
        res.json(false);
      } else {
        client.query("UPDATE bikes SET rented_by = null WHERE id = $1", [bike_id], function(error, result) {
          done();
          if (error) return console.log(error);
          console.log("Bike " + bike_id + " was returned by " + user_id);
          res.json(true);
        });
      }
    });
  });
});




router.get("/bike/:id/lock", function (req, res) {
  pool.connect(function(error, client, done) {
    if (error) return console.log(error);
    client.query('SELECT electron_id FROM bikes WHERE id = $1', [req.params.id], function(error, result) {
      done();
      if (error) return console.log(error);
      console.log(result);
      var coreid = result.rows[0].electron_id;
      console.log(coreid);
      particle.callFunction({deviceId: coreid, name: 'L', argument: '1', auth: '8789d99db6ad440dcd00077b1e1c45a6efe07db9'}).then( function(data) {
        saveLockStatus(coreid, true);
        console.log('Bicycle locked succesfully:', data);
        res.json(true);
      }, function(err) {
        saveLockStatus(coreid, false)
        console.log('Bicycle not locked. An error occurred:', err);
        res.json(false);
      });
    });
  });
});


router.get("/bike/:id/unlock", function (req, res) {
  pool.connect(function(error, client, done) {
    if (error) return console.log(error);
    client.query('SELECT electron_id FROM bikes WHERE id = $1', [req.params.id], function(error, result) {
      done();
      if (error) return console.log(error);
      var coreid = result.rows[0].electron_id;
      particle.callFunction({deviceId: coreid, name: 'L', argument: '0', auth: '8789d99db6ad440dcd00077b1e1c45a6efe07db9'}).then( function(data) {
        saveLockStatus(coreid, false);
        console.log('Bicycle unlocked succesfully:', data);
        res.json(true);
      }, function(err) {
        saveLockStatus(coreid, true)
        console.log('Bicycle not unlocked. An error occurred:', err);
        res.json(false);
      });
    });
  });
});



function saveLockStatus(coreid, status){
  pool.connect(function(error, client, done) {
    if (error) return console.log(error);
    client.query("UPDATE bikes SET locked = $1 WHERE electron_id = $2", [status, coreid], function(error, result) {
      done();
      if (error) return console.log(error);
    });
  });
}



router.get("/bike/:id/find", function (req, res) {
  pool.connect(function(error, client, done) {
    if (error) return console.log(error);
    client.query('SELECT electron_id FROM bikes WHERE id = $1', [req.params.id], function(error, result) {
      done();
      if (error) return console.log(error);
      var coreid = result.rows[0].electron_id;
      particle.callFunction({deviceId: coreid, name: 'F', argument: '', auth: '8789d99db6ad440dcd00077b1e1c45a6efe07db9'}).then( function(data) {
        console.log('Bicycle find sent succesfully:', data);
        res.json(true);
      }, function(err) {
        console.log('Bicycle find NOT sent. An error occurred:', err);
        res.json(false);
      });
    });
  });
});






router.get("/pois", function (req, res) {
  request('http://www.google.com', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body); // Print the google web page.
    }
  });
  
});

