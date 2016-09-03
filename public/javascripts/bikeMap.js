
app.directive('bikeMap', function($filter){

  return {

    restrict: 'A',
    replace: true,
    scope: {},
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

    }
  };

});