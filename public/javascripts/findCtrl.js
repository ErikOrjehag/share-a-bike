
app.controller("findCtrl", function ($scope, $http, $timeout, $location) {

  $scope.bikes = [];
  var pollTime = 3000;

  (function fetchBikes() {
    $http.get("/api/bikes")
      .then(function (response) {
        $scope.bikes = response.data;
      }, function (error) {
        console.log(error);
      })
      .finally(function () {
        $timeout(fetchBikes, pollTime);
      });
  })();

  $scope.goToBike = function (id) {
    $location.path("/bike/" + id);
  };


});