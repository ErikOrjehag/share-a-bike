
app.controller("profileCtrl", function ($scope, $http, loginFactory, $timeout) {

  $scope.user = {};
  $scope.borrowing = false;
  $scope.borrowingList = [];
  var promise;
  var polltime = 1000;

  $scope.bikes = [];

  $scope.comments = [];

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
    $http.get("/api/bike/" + bike.id + "/find")
      .then(function (response) {
        console.log(response);
      }, function (error) {
        console.log(error);
      });
  };

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

  $http.get("/api/user/" + loginFactory.getUserId() + "/comments")
    .then(function (response) {
      $scope.comments = response.data;
    }, function (error) {
      console.log(errors);
    });

});