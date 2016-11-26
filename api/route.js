
var router = module.exports = require("express").Router();

const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;
const polyline = require('polyline');
var request = require('request');

const client = new Lokka({
  transport: new Transport('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql')
});

router.post("/route", function (req, res) {

  var from = req.body.from;
  var to = req.body.to;

  console.log(from, to);

  request({
    method: 'GET',
    url: 'http://api.digitransit.fi/geocoding/v1/search',
    qs: {
      text: from,
      lang: "sv",
      size: "1"
    },
    json: true
  }, function (error, response, body) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }
    if (body.features.length) {
      var fromCoords = body.features[0].geometry.coordinates;


      request({
        method: 'GET',
        url: 'http://api.digitransit.fi/geocoding/v1/search',
        qs: {
          text: to,
          lang: "sv",
          size: "1"
        },
        json: true
      }, function (error, response, body) {
        if (error) {
          console.log(error);
          res.sendStatus(500);
          return;
        }
        if (body.features.length) {
          var toCoords = body.features[0].geometry.coordinates;

          console.log(fromCoords, toCoords);

          var query = `
            {
              plan(
                fromPlace: "${from}",
                from: {lat: ${fromCoords[1]}, lon: ${fromCoords[0]} },
                toPlace: "${to}",
                to: {lat: ${toCoords[1]}, lon: ${toCoords[0]} },
                modes: "BICYCLE",
                walkReluctance: 2.1,
                walkBoardCost: 600,
                minTransferTime: 180,
                walkSpeed: 1.2,
                maxWalkDistance: 10000
              ) {
                itineraries{
                  walkDistance,
                  duration,
                  legs {
                    mode
                    startTime
                    endTime
                    from {
                      lat
                      lon
                      name
                      stop {
                        code
                        name

                      }
                    },
                    to {
                      lat
                      lon
                      name
                    },
                    agency {
                      id
                    },
                    distance
                    legGeometry {
                      length
                      points
                    }
                  }
                }
              }
            }
          `;

          console.log(query);

          client.query(query).then(result => {

              console.log(result);

              result.plan.itineraries.forEach(it => {
                it.legs.forEach(leg => {
                  leg.legGeometry.points = polyline.decode(leg.legGeometry.points);
                });
              });

              res.json(result);
            });
          }
        });
    }
  });
});