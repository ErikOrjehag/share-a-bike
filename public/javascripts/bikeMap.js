
app.directive('bikeMap', function($filter, $http){

  return {

    restrict: 'A',
    replace: true,
    scope: {
      bikes: "=bikeMapBikes",
      routes: "=bikeMapRoutes",
      showPaths: "=bikeMapShowPaths",
      showPoints: "=bikeMapShowPoints",
      checkboxes: "=bikeMapCheckboxes"
    },
    template: '<div></div>',

    link : function (scope, element, attrs) {

      // Create leaflet map.
      scope.map = L.map(element[0], {
        center: [60.193408, 24.946755],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        minZoom: 10,
        maxZoom: 18
      });

      // Add tiles to the map
      scope.map.addLayer(L.tileLayer('http://api.digitransit.fi/map/v1/hsl-map/{z}/{x}/{y}.png', {
        //tileSize: 256*2
      }));

      //scope.map.addControl(new L.Control.ZoomLevelList());

      /*scope.map.on("move", function (e) {
        console.log(scope.map.getCenter(), scope.map.getZoom());
      });*/

      /*$http.get("/api/route")
        .then(function (response) {
          response.data.plan.itineraries.forEach(function (it) {
            it.legs.forEach(function (leg) {
              L.polyline(leg.legGeometry.points).addTo(scope.map);
            });
          });
        }, function (error) {
          console.log(error);
        });*/
    },

    controller: function ($scope) {

      $scope.hasSetBounds = false;

      $scope.$watch('bikes', function (newValue, oldValue) {

        if ($scope.bikeLayer) {
          $scope.map.removeLayer($scope.bikeLayer);
        }

        if (typeof newValue !== "undefined") {

          var markers = newValue.map(function (bike) {
            if (!bike.positions) bike.positions =  [{ lat: 58.429816, lon: 15.723542 }];
            return new L.Marker.Label([bike.positions[0].lat, bike.positions[0].lon], {
              icon: new L.Icon.Label({
                iconUrl: "/images/icons/bicycle-rider.png",
                iconSize: [30, 30],
                labelText: bike.bike_name,
                wrapperAnchor: new L.Point(15, 15),
                iconAnchor: new L.Point(0, 0),
                labelAnchor: new L.Point(35, 3)
              })
            });
          });

          var lines = [];

          if ($scope.showPaths) {
            lines = newValue.map(function (bike) {
              return L.polyline(bike.positions.map(function (position) {
                return [position.lat, position.lon];
              }));
            });
          }

          var features = markers.concat(lines);

          $scope.bikeLayer = L.featureGroup(features);

          if (features.length) {
            if (!$scope.hasSetBounds) {
              $scope.hasSetBounds = true;
              //$scope.map.fitBounds($scope.bikeLayer.getBounds(), { maxZoom: 16, padding: [1, 1] });
            }
            $scope.map.addLayer($scope.bikeLayer);
          }
        }
      });

      $scope.$watch('routes', function (newValue, oldValue) {
        if ($scope.routesLayer) {
          $scope.map.removeLayer($scope.routesLayer);
        }

        if (typeof newValue !== "undefined") {
          var features = newValue.map(function (route) {
            return L.polyline(route);
          });
          $scope.routesLayer = L.featureGroup(features);
          $scope.map.addLayer($scope.routesLayer);
        }
      });

      if ($scope.showPoints) {
        $http.get("/api/points")
          .then(function (response) {
            $scope.points = response.data;
            showPoints();
          }, function (error) {
            console.log(error);
          });

        $scope.$watch('checkboxes', showPoints, true);
      }

      console.log($scope.checkboxes);

      function showPoints () {

        console.log("showPoints");

        if (!$scope.points) {
          return;
        }

        var features = [];

        if ($scope.checkboxes.pumps) {
          $scope.points.pumps.forEach(function (pump) {
            features.push(L.marker([pump[1], pump[0]], {
              icon: L.icon({
                iconUrl: "/images/icons/pump.png",
                iconSize: [20, 20]
              })
            }));
          });
        }

        if ($scope.checkboxes.parking) {
          $scope.points.parking.forEach(function (pump) {
            features.push(L.marker([pump[1], pump[0]], {
              icon: L.icon({
                iconUrl: "/images/icons/parking2.png",
                iconSize: [20, 20]
              })
            }));
          });
        }

        if ($scope.checkboxes.turistinfo) {
          $scope.points.turistinfo.forEach(function (pump) {
            features.push(L.marker([pump[1], pump[0]], {
              icon: L.icon({
                iconUrl: "/images/icons/information.png",
                iconSize: [20, 20]
              })
            }));
          });
        }

        if ($scope.checkboxes.museum) {
          $scope.points.museum.forEach(function (pump) {
            features.push(L.marker([pump[1], pump[0]], {
              icon: L.icon({
                iconUrl: "/images/icons/theater.png",
                iconSize: [20, 20]
              })
            }));
          });
        }

        if ($scope.pointsLayer) {
          $scope.map.removeLayer($scope.pointsLayer);
        }

        $scope.pointsLayer = L.featureGroup(features);

        $scope.map.addLayer($scope.pointsLayer);
      }
    }
  };

});