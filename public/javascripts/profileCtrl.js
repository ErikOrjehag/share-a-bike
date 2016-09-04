
app.controller("profileCtrl", function ($scope, $http, loginFactory, $timeout) {

  $scope.user = {};
  $scope.borrowing = false;
  $scope.borrowingList = [];
  var promise;
  var polltime = 3000;

  $scope.bikes = [];

  $scope.comments = [];

  $scope.lockWaiting = false;
  $scope.unlockWaiting = false;
  $scope.findWaiting = false;

  $http.get("/api/user/" + loginFactory.getUserId())
    .then(function (response) {
      $scope.user = response.data;
      $scope.profilePictureStyle = {
        "background-image": "url(\"" + $scope.user.image_url + "\")"
      };
    }, function (error) {
      console.log(error);
    });

  function fetchBorrowing() {
    $http.get("/api/bikeBorrowing/" + loginFactory.getUserId())
      .then(function (response) {
        if (response.data) {
          $http.get("/api/bike/" + response.data)
            .then(function (response) {
              $scope.borrowing = response.data;
              $scope.borrowingList = [$scope.borrowing];
            }, function (error) {
              console.log(error);
            });
        } else {
          $scope.borrowing = false;
          $scope.borrowingList = [];
        }
      }, function (error) {
        console.log(error);
      })
      .finally(function () {
        promise = $timeout(fetchBorrowing, polltime);
      });
  }

  fetchBorrowing();

  $scope.stolen = function (bike) {
    return bike && bike.moved && bike.locked;
  };

  $scope.return = function (bike) {
    $http.get("/api/bike/" + bike.id + "/return/" + loginFactory.getUserId())
      .then(function (result) {
        if (result.data) {
          if (promise) {
            $timeout.cancel(promise);
          }
          fetchBorrowing();
        } else {
          console.log("COULD NOT RETURN BIKE :(", result.data);
        }
      }, function (error) {
        console.log(error);
      });
  };

  function fetchBikes () {
    $http.get("/api/bikes")
      .then(function (response) {
        $scope.bikes = response.data.filter(function (bike) {
          return bike.owner === loginFactory.getUserId();
        });
      }, function (error) {
        console.log(error);
      })
      .finally(function () {
        $timeout(fetchBikes, polltime);
      });
  }

  fetchBikes();

  $scope.image = function (bike) {
    return {
      "background-image": "url(\"" + bike.image_url + "\")"
    };
  };

  $scope.find = function (bike) {
    $scope.findWaiting = true;
    $http.get("/api/bike/" + bike.id + "/find")
      .then(function (response) {
        console.log(response);
      }, function (error) {
        console.log(error);
      })
      .finally(function () {
        $scope.findWaiting = false;
      });
  };

  $scope.lock = function (bike) {
    $scope.lockWaiting = true;
    $http.get("/api/bike/" + bike.id + "/lock")
      .then(function (response) {
        $scope.lockWaiting = false;
        console.log($scope.lockWaiting);
        console.log(response);
        if (promise) {
          $timeout.cancel(promise);
        }
        fetchBorrowing();
      }, function (error) {
        $scope.lockWaiting = false;
        console.log($scope.lockWaiting);
        console.log(error);
      });
  };

  $scope.unlock = function (bike) {
    $scope.unlockWaiting = true;
    $http.get("/api/bike/" + bike.id + "/unlock")
      .then(function (response) {
        $scope.unlockWaiting = false;
        console.log($scope.unlockWaiting);
        console.log(response);
        if (promise) {
          $timeout.cancel(promise);
        }
        fetchBorrowing();
      }, function (error) {
        $scope.unlockWaiting = false;
        console.log($scope.unlockWaiting);
        console.log(error);
      });
  };

  $http.get("/api/user/" + loginFactory.getUserId() + "/comments")
    .then(function (response) {
      $scope.comments = response.data;
    }, function (error) {
      console.log(errors);
    });

});