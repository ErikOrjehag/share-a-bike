var pool = require("./pool");

console.log("Load electron code");
var Particle = require('particle-api-js');
var particle = new Particle();



particle.getVariable({ deviceId: '49003c001951343334363036', name: 'G', auth: '8789d99db6ad440dcd00077b1e1c45a6efe07db9' }).then(function(data) {
    console.log('Device variable retrieved successfully:', data);
}, function(err) {
    console.log('An error occurred while getting attrs:', err);
});



particle.getEventStream({ deviceId: '49003c001951343334363036', name: 'G', auth: '8789d99db6ad440dcd00077b1e1c45a6efe07db9' }).then(function(stream) {
  stream.on('event', function(data) {
    console.log(data);
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


