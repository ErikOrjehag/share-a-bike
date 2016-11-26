
app.controller("findCtrl", function ($scope, $http, $timeout, $location, loginFactory) {

  $scope.bikes = [];
  $scope.routes = [];
  var pollTime = 3000;
  var promise = null;

  $scope.checkboxes = {
    pumps: true,
    parking: false,
    turistinfo: false,
    museum: false
  };

  function fetchBikes() {
    $http.get("/api/bikes")
      .then(function (response) {
        $scope.bikes = response.data.filter(function (bike) {
          return bike.owner !== loginFactory.getUserId();
        });
      }, function (error) {
        console.log(error);
      })
      .finally(function () {
        promise = $timeout(fetchBikes, pollTime);
      });
  }

  fetchBikes();

  $scope.goToBike = function (id) {
    $location.path("/bike/" + id);
  };

  $scope.shouldShowRentBike = function (bike) {
    var id = loginFactory.getUserId();
    var alreadyRents = $scope.bikes.reduce(function (prev, curr) {
      return prev || curr.rented_by === id;
    }, false);
    return !bike.rented_by && !alreadyRents;
  };

  $scope.shouldShowReturnBike = function (bike) {
    return bike.rented_by === loginFactory.getUserId();
  };

  $scope.shouldShowNotAvailable = function (bike) {
    return bike.rented_by && bike.rented_by !== loginFactory.getUserId();
  };

  $scope.shouldShowGrayRentBike = function (bike) {
    var id = loginFactory.getUserId();
    var alreadyRents = $scope.bikes.reduce(function (prev, curr) {
      return prev || curr.rented_by === id;
    }, false);
    return !$scope.shouldShowNotAvailable(bike) && !$scope.shouldShowReturnBike(bike) && !$scope.shouldShowRentBike(bike);
  };

  $scope.rent = function (bike) {
    $http.get("/api/bike/" + bike.id + "/rent/" + loginFactory.getUserId())
      .then(function (result) {
        if (result.data) {
          if (promise) {
            $timeout.cancel(promise);
          }
          fetchBikes();
        } else {
          console.log("COULD NOT RENT BIKE :(", result.data);
        }
      }, function (error) {
        console.log(error);
      });
  };

  $scope.return = function (bike) {
    $http.get("/api/bike/" + bike.id + "/return/" + loginFactory.getUserId())
      .then(function (result) {
        if (result.data) {
          if (promise) {
            $timeout.cancel(promise);
          }
          fetchBikes();
        } else {
          console.log("COULD NOT RETURN BIKE :(", result.data);
        }
      }, function (error) {
        console.log(error);
      });
  };

  $scope.stolen = function (bike) {
    return bike && bike.moved && bike.locked;
  };

  $scope.onRoutes = function (routes) {
    console.log(routes);
    $scope.routes = routes;
  };

});