
app.controller("findCtrl", function ($scope, $http, $timeout) {

  $scope.bikes = [];
  var pollTime = 3000;

  (function fetchBikes() {
    $http.get("/api/bikes")
      .then(function (response) {
        $scope.bikes = response.data;
        console.log($scope.bikes);
      }, function (error) {
        console.log(error);
      })
      .finally(function () {
        $timeout(fetchBikes, pollTime);
      });
  })();


});