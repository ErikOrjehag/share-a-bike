
app.directive('bikeMap', function($filter, $http){

  return {

    restrict: 'A',
    replace: true,
    scope: {
      bikes: "=bikeMapBikes",
      showPaths: "=bikeMapShowPaths",
      showPoints: "=bikeMapShowPoints",
      checkboxes: "=bikeMapCheckboxes"
    },
    template: '<div></div>',

    link : function (scope, element, attrs) {

      // Create leaflet map.
      scope.map = L.map(element[0], {
        center: [58.39404312677626, 15.561318397521973],
        zoom: 10,
        zoomControl: false,
        attributionControl: false,
        minZoom: 10,
        maxZoom: 18
      });

      // Add tiles to the map
      scope.map.addLayer(L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png'));

      //scope.map.addControl(new L.Control.ZoomLevelList());

      /*scope.map.on("move", function (e) {
        console.log(scope.map.getCenter(), scope.map.getZoom());
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
            return new L.Marker.Label([bike.positions[0].lat, bike.positions[0].lon], {
              icon: new L.Icon.Label({
                iconUrl: "http://138.68.129.101/images/icons/bicycle-rider.png",
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
              $scope.map.fitBounds($scope.bikeLayer.getBounds(), { maxZoom: 16, padding: [1, 1] });
            }
            $scope.map.addLayer($scope.bikeLayer);
          }
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