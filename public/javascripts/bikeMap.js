
app.directive('bikeMap', function($filter){

  return {

    restrict: 'A',
    replace: true,
    scope: {
      bikes: "=bikeMapBikes",
      showPaths: "=bikeMapShowPaths"
    },
    template: '<div></div>',

    link : function (scope, element, attrs) {

      // Create leaflet map.
      scope.map = L.map(element[0], {
        center: [58.39404312677626, 15.561318397521973],
        zoom: 17,
        zoomControl: false,
        attributionControl: false,
        minZoom: 2,
        maxZoom: 18
      });

      // Add tiles to the map
      scope.map.addLayer(L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png'));

      /*scope.map.on("move", function (e) {
        console.log(scope.map.getCenter(), scope.map.getZoom());
      });*/
    },

    controller: function ($scope) {

      $scope.$watch('bikes', function (newValue, oldValue) {

        if ($scope.bikeLayer) {
          $scope.map.removeLayer($scope.bikeLayer);
        }

        if (typeof newValue !== "undefined") {


          /*var port = new L.Marker.Label([0, 0], {
            icon: new L.Icon.Label({
              iconUrl: config.aismodhost + '/icon/port/ff6c00',
              iconSize: [20, 20],
              labelText: '',
              labelAnchor: new L.Point(25, -3),
              wrapperAnchor: new L.Point(10, 10), // half the size
              iconAnchor: new L.Point(0, 0)
            }),
            zIndexOffset: 2000,
            revealing: true
          });*/

          var markers = newValue.map(function (bike) {
            //return L.marker([bike.positions[0].lat, bike.positions[0].lon]);
            return new L.Marker.Label([bike.positions[0].lat, bike.positions[0].lon], {
              icon: new L.Icon.Label({
                iconUrl: "http://138.68.129.101/images/wille.png",
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

          $scope.map.addLayer($scope.bikeLayer);
        }
      });
    }
  };

});