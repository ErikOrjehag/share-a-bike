
var router = module.exports = require("express").Router();
var pool = require('../pool');
var Particle = require('particle-api-js');
var particle = new Particle();


router.get("/bike/:id/lock", function (req, res) {
  pool.connect(function(error, client, done) {
    if (error) return console.log(error);
    client.query('SELECT electron_id FROM bikes WHERE id = $1', [req.params.id], function(error, result) {
      done();
      if (error) return console.log(error);
      console.log(result);
      var coreid = result.rows[0].electron_id;
      console.log(coreid);
      particle.callFunction({deviceId: coreid, name: 'lock', argument: '1', auth: '8789d99db6ad440dcd00077b1e1c45a6efe07db9'}).then( function(data) {
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
      particle.callFunction({deviceId: coreid, name: 'lock', argument: '0', auth: '8789d99db6ad440dcd00077b1e1c45a6efe07db9'}).then( function(data) {
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

