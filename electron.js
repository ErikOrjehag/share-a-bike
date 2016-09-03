var pool = require("./pool");

console.log("Load electron code");
var Particle = require('particle-api-js');
var particle = new Particle();


// Get initial GPS coord, not using event!
particle.getVariable({ deviceId: '49003c001951343334363036', name: 'G', auth: '8789d99db6ad440dcd00077b1e1c45a6efe07db9' }).then(function(data) {
    //console.log('Device variable retrieved successfully:', data);
    console.log(data);
    pool.connect(function(error, client, done) {
      if (error) return console.log(error);
	if(data.body.result){
          client.query("INSERT INTO bike_positions (ts, pos, bike_id) VALUES ($1, ST_GeomFromText($2::text), (SELECT id from bikes WHERE electron_id = $3))", [data.published_at, "POINT("+data.data.replace(',',' ')+")", data.coreid], function(error, result) {
          done();
          if (error) return console.log(error);
          console.log("Saved: " + data.data);
        });
      }
      client.query("UPDATE bikes SET online = $1 WHERE electron_id = $2", [data.body.coreInfo.connected, data.body.coreInfo.deviceID], function(error, result) {
        done();
        if (error) return console.log(error);
        console.log(data.body.coreInfo.connected?"Bike is online":"Bike is offline");
      });
    });
}, function(err) {
    //console.log('An error occurred while getting attrs:', err);
    pool.connect(function(error, client, done) {
      if (error) return console.log(error);
      client.query("UPDATE bikes SET online = false WHERE electron_id = '49003c001951343334363036'", [], function(error, result) {
        done();
        if (error) return console.log(error);
        console.log("Bike is offline");
      });
    });
});


// Get GPS coords with events
particle.getEventStream({ deviceId: '49003c001951343334363036', name: 'G', auth: '8789d99db6ad440dcd00077b1e1c45a6efe07db9' }).then(function(stream) {
  stream.on('event', function(data) {
    pool.connect(function(error, client, done) {
      if (error) return console.log(error);
        client.query("INSERT INTO bike_positions (ts, pos, bike_id) VALUES ($1, ST_GeomFromText($2::text), (SELECT id from bikes WHERE electron_id = $3))", [data.published_at, "POINT("+data.data.replace(',',' ')+")", data.coreid], function(error, result) {
        done();
        if (error) return console.log(error);
        console.log("Saved: " + data.data);
      });
    });
  });
});


// Get moving with events
particle.getEventStream({ deviceId: '49003c001951343334363036', name: 'M', auth: '8789d99db6ad440dcd00077b1e1c45a6efe07db9' }).then(function(stream) {
  stream.on('event', function(data) {
    console.log("M recieved");
    pool.connect(function(error, client, done) {
      if (error) return console.log(error);

      client.query("UPDATE bikes SET moved=$1 WHERE electron_id = $2", [data.data == "1", data.coreid], function(error, result) {
        done();
        if (error) return console.log(error);
        console.log((data.data == "1")?"Bicycle is moving":"Bicycling is not moving");
      });
    });
  });
});


// Get button with events
particle.getEventStream({ deviceId: '49003c001951343334363036', name: 'B', auth: '8789d99db6ad440dcd00077b1e1c45a6efe07db9' }).then(function(stream) {
  stream.on('event', function(data) {
    console.log("Button pressed");
    /*pool.connect(function(error, client, done) {
      if (error) return console.log(error);
      client.query("UPDATE bikes SET locked = NOT locked WHERE electron_id = $1", [data.coreid], function(error, result) {
        done();
        if (error) return console.log(error);
      });

    });*/
  });
});

