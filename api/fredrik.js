
var router = module.exports = require("express").Router();
var pool = require('../pool');
var Particle = require('particle-api-js');
var particle = new Particle();
var request = require('request');
var proj4 = require('proj4')
 

router.get("/bike/:id/rent/:user", function (req, res) {
  var bike_id = req.params.id;
  var user_id = req.params.user;

  pool.connect(function(error, client, done) {
    if (error) return console.log("fredrik 1", error);

    client.query('SELECT rented_by FROM bikes WHERE id = $1', [bike_id], function(error, result) {

      if (error) return console.log("fredrik 2", error);
      
      if(result.rows[0].rented_by !== null){
        done();
        console.log("User #" +user_id+ " can't rent a bike that is already rent by user #" + result.rows[0].rented_by);
        res.json(false);
      } else {
        client.query("UPDATE bikes SET rented_by = $1 WHERE id = $2", [user_id, bike_id], function(error, result) {
          done();
          if (error) return console.log("fredrik 3", error);
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
    if (error) return console.log("fredrik 4", error);
    client.query('SELECT rented_by FROM bikes WHERE id = $1', [bike_id], function(error, result) {
      if (error) return console.log("fredrik 5", error);
      
      if(result.rows[0].rented_by != user_id){
        done();
        console.log("User #"+user_id+" can't return a bike that was rented by user #" + result.rows[0].rented_by);
        res.json(false);
      } else {
        client.query("UPDATE bikes SET rented_by = null WHERE id = $1", [bike_id], function(error, result) {
          done();
          if (error) return console.log("fredrik 6", error);
          console.log("Bike " + bike_id + " was returned by " + user_id);
          res.json(true);
        });
      }
    });
  });
});




router.get("/bike/:id/lock", function (req, res) {
  lock(req.params.id, function(status){
    res.json(status);
  });
});


router.get("/bike/:id/unlock", function (req, res) {
  unlock(req.params.id, function(status){
    res.json(status);
  });
});

function lock(bikeId, callback){
  pool.connect(function(error, client, done) {
    if (error) return console.log("fredrik 7", error);
    client.query('SELECT electron_id FROM bikes WHERE id = $1', [bikeId], function(error, result) {
      done();
      if (error) return console.log(error);
      var coreid = result.rows[0].electron_id;
      particle.callFunction({deviceId: coreid, name: 'L', argument: '1', auth: '16bcdfcf9e104f8ac63a581449d13316c4032300'}).then( function(data) {
        saveLockStatus(coreid, true);
        console.log('Bicycle locked succesfully:', data);
        res.json(true);
      }, function(err) {
        saveLockStatus(coreid, false);
        console.log('Bicycle not locked. An error occurred:', err);
        res.json(false);
      });
    });
  });
}



function unlock(bikeId, callback){
  pool.connect(function(error, client, done) {
    if (error) return console.log(error);
    client.query('SELECT electron_id FROM bikes WHERE id = $1', [bikeId], function(error, result) {
      done();
      if (error) return console.log("fredrik 8", error);
      var coreid = result.rows[0].electron_id;
      particle.callFunction({deviceId: coreid, name: 'L', argument: '0', auth: '16bcdfcf9e104f8ac63a581449d13316c4032300'}).then( function(data) {
        saveLockStatus(coreid, false);
        console.log('Bicycle unlocked succesfully:', data);
        callback(true);
      }, function(err) {
        saveLockStatus(coreid, true);
        console.log('Bicycle not unlocked. An error occurred:', err);
        callback(false);
      });
    });
  });
}



function saveLockStatus(coreid, status){
  pool.connect(function(error, client, done) {
    if (error) return console.log("fredrik 9", error);
    client.query("UPDATE bikes SET locked = $1 WHERE electron_id = $2", [status, coreid], function(error, result) {
      done();
      if (error) return console.log("fredrik 10", error);
    });
  });
}



router.get("/bike/:id/find", function (req, res) {
  pool.connect(function(error, client, done) {
    if (error) return console.log("fredrik 11", error);
    client.query('SELECT electron_id FROM bikes WHERE id = $1', [req.params.id], function(error, result) {
      done();
      if (error) return console.log("fredrik 12", error);
      var coreid = result.rows[0].electron_id;
      particle.callFunction({deviceId: coreid, name: 'F', argument: '', auth: '16bcdfcf9e104f8ac63a581449d13316c4032300'}).then( function(data) {
        console.log('Bicycle find sent succesfully:', data);
        res.json(true);
      }, function(err) {
        console.log('Bicycle find NOT sent. An error occurred:', err);
        res.json(false);
      });
    });
  });
});


router.get("/user/:id/report/:pos", function (req, res) {
  pool.connect(function(error, client, done) {
    if (error) return console.log("fredrik 13", error);
    client.query("UPDATE users SET pos=ST_GeomFromText($1::text) WHERE id = $2", ["POINT("+req.params.pos.replace(',',' ')+")", req.params.id], function(error, result) {

      if (error) {res.json(false); return console.log("fredrik 14", error);};
      console.log("Position for user #"+req.params.id+" updated to "+req.params.pos);
      res.json(true);

      // Should the bike get locked or unlocked? Where is the bike that this user have borrowed?
      client.query("SELECT ST_Distance(pos,ST_GeomFromText($1::text)) as distance, bike_id FROM bike_positions WHERE bike_id = (SELECT id FROM bikes WHERE rented_by = $2) ORDER BY ts DESC LIMIT 1", ["POINT("+req.params.pos.replace(',',' ')+")", req.params.id], function(error, result) {
        done();
        if (error) {return console.log("fredrik 15", error);}
        if(result.rows.length == 0){
          console.log("User #" + req.params.id + " doesn't rent any bikes currently");
          return;
        }

        var distance = result.rows[0].distance;
	var bikeId = result.rows[0].bike_id;
        console.log("Current distance is: " + distance);
        if(distance < 0.0001){
          console.log("User #" + req.params.id + " automatically unlocks bike "+bikeId);
          unlock(bikeId, function(){});
        }else if (distance > 0.0005){
          console.log("User #" + req.params.id + " automatically locks bike "+bikeId);
          lock(bikeId, function(){});
        }

      });
    });

  });
});





router.get("/points", function (req, res) {
  var points = {};

  // "Caches" data to load faster! The datasources were too slow. 
  res.json({"pumps":[[15.787079672992585,58.43638046016017],[15.678191629477016,58.425511294902],[15.663679261346605,58.39507546830998],[15.642589763484642,58.405889903839686],[15.62554662293693,58.415997092842076],[15.618893337933113,58.4119695247441],[15.58336752351237,58.4260338653626],[15.564666314506276,58.40842048389426],[15.501766609342132,58.508914608261875],[15.52186121112543,58.482285912019265],[15.645856268337939,58.39328279589445],[15.566877652678913,58.387956433601474],[15.67930575320561,58.381117172043794],[15.690072239845067,58.36699907760191],[15.7214758208513,58.335934888125955],[15.433583077968535,58.38330594848996],[15.433881746084893,58.38405557725955]],"parking":[[15.625155079262836,58.41614401697647],[15.627001059700993,58.415322042316966],[15.626741462802606,58.40900563606879],[15.624478810744966,58.40939570823315],[15.623604431849827,58.4098170397446],[15.62731535453292,58.41003065854538],[15.628762582854776,58.410349098168545],[15.625065281609624,58.41049853781791],[15.625312874947838,58.41111346390892],[15.628438610094646,58.41147740897747],[15.624767850811306,58.411637954811795],[15.626668988300397,58.41164060051114],[15.618733664540695,58.41187656660197],[15.619282476140533,58.411222451547495],[15.619919011516206,58.41147561139478],[15.620046292089498,58.409803784118495],[15.620143027378043,58.411058735249284],[15.62137411014764,58.41085177195244],[15.621551503802745,58.41040097294378],[15.62220393283767,58.4096077294098],[15.622479295641057,58.41194581015928]],"turistinfo":[[15.626481646664537,58.411437754879046],[15.620528308163475,58.40805244973378],[15.612885614816777,58.411521963414415],[15.61656263464773,58.41110274517821],[15.52132977617442,58.41043017515691],[15.588745396654105,58.40528335726796],[15.684052875811505,58.220411167685356],[15.43354854108743,58.12581252873637]],"museum":[[15.616167855896672,58.41396866145069],[15.615963905660019,58.410614566134235],[15.589667108435188,58.40587836291487],[15.517431686713806,58.41055209246643],[15.427593547610911,58.51844721037464],[15.394321937454825,58.48235583080966],[15.608589769183505,58.39547393563037],[15.584909253065298,58.40034375409828],[15.663981003914238,58.210202639972]]});
  return;

  getList('http://kartan.linkoping.se/isms/poi?service=wfs&request=getfeature&typename=cykelpumpar&version=1.1.0&', function(list){
    points.pumps = list;
    getList('http://kartan.linkoping.se/isms/poi?service=wfs&request=getfeature&typename=cykelparkering&version=1.1.0&', function(list){
      points.parking=list;
      getList('http://kartan.linkoping.se/isms/poi?service=wfs&request=getfeature&typename=turistinfo&version=1.1.0&', function(list){
        points.turistinfo=list;
        getList('http://kartan.linkoping.se/isms/poi?service=wfs&request=getfeature&typename=museum&version=1.1.0&', function(list){
          points.museum=list;
/*


          request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              body.match(/^.+X_SWEREF991500.+$/gim).forEach(function(txt){
        	var coord = txt.substring(txt.indexOf(">")+1, txt.indexOf("</"));
                var longlat = proj4('+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', 'WGS84', [coord[1], coord[0]]);
                console.log("coord: ", longlat, coord);
                points.vagarbeten.push(longlat);
              });
              res.json(points);              
            }
          });
*/            res.json(points);

        });
      });
    });
  });
});


function getList(url, callback){
  var list = [];
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body.match(/^.+gml:pos.+$/gim).forEach(function(txt){
	var coord = txt.substring(txt.indexOf(">")+1, txt.indexOf("</gml")).split(" ");
        var longlat = proj4('+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', 'WGS84', [coord[1], coord[0]]);
        console.log("coord: ", longlat, coord);
        list.push(longlat);
      });
      callback(list);
    }
  });
}
