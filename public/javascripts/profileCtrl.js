
app.controller("profileCtrl", function ($scope, $http, loginFactory, $timeout) {

  $scope.user = {};
  $scope.borrowing = false;
  $scope.borrowingList = [];
  var promise;
  var polltime = 1000;

  $scope.bikes = [];

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
    console.log("fetch");
    $http.get("/api/bikeBorrowing/" + loginFactory.getUserId())
      .then(function (response) {
        console.log(response.data);
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

  $scope.return = function () {
    $http.get("/api/bike/" + $scope.borrowing.id + "/return/" + loginFactory.getUserId())
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

});