
app.controller("controlCtrl", function ($scope, $http, loginFactory, $timeout) {

  $scope.user = {};
  $scope.borrowing = false;
  var promise;
  var polltime = 3000;

  $scope.user_id = loginFactory.getUserId();

  function fetchBorrowing() {
    $http.get("/api/bikeBorrowing/" + loginFactory.getUserId())
      .then(function (response) {
        if (response.data) {
          $http.get("/api/bike/" + response.data)
            .then(function (response) {
              $scope.borrowing = response.data;
            }, function (error) {
              console.log(error);
            });
        } else {
          $scope.borrowing = false;
        }
      }, function (error) {
        console.log(error);
      })
      .finally(function () {
        promise = $timeout(fetchBorrowing, polltime);
      });
  }

  fetchBorrowing();

  $scope.lock = function (bike) {
    $http.get("/api/bike/" + bike.id + "/lock")
      .then(function (response) {
        console.log(response);
        if (promise) {
          $timeout.cancel(promise);
        }
        fetchBorrowing();
      }, function (error) {
        console.log(error);
      });
  };

  $scope.unlock = function (bike) {
    $http.get("/api/bike/" + bike.id + "/unlock")
      .then(function (response) {
        console.log(response);
        if (promise) {
          $timeout.cancel(promise);
        }
        fetchBorrowing();
      }, function (error) {
        console.log(error);
      });
  };

});