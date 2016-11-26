
app.directive('bikeMapOverlay', function($http){

  return {

    restrict: 'A',
    replace: true,
    scope: {
      routesCallback: "&onRoutes"
    },
    templateUrl: '/templates/bikeMapOverlay.html',

    link : function (scope, element, attrs) {

    },

    controller: function ($scope) {

      $scope.findRoute = function () {
        $http({
          method: 'POST',
          url: '/api/route',
          data: {
            from: $scope.from,
            to: $scope.to
          }
        }).then(function (response) {

          console.log(response);

          var routes = [];

          response.data.plan.itineraries.forEach(function (it) {
            it.legs.forEach(function (leg) {
              routes.push(leg.legGeometry.points);
            });
          });

          console.log(routes);

          $scope.routesCallback({ routes: routes });
        });
      };
    }
  };

});