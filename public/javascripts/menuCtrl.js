
app.controller("menuCtrl", function ($scope, $rootScope, $http, loginFactory) {

  $scope.isLoggedIn = loginFactory.isLoggedIn();
  $scope.fullName = "";

  if ($scope.isLoggedIn) {
    fetchFullName(loginFactory.getUserId(), function (fullName) {
      $scope.fullName = fullName;
    });
  }

  $scope.$on("login", function () {
    $scope.isLoggedIn = loginFactory.isLoggedIn();
    fetchFullName(loginFactory.getUserId(), function (fullName) {
      $scope.fullName = fullName;
    });
  });

  $scope.$on("logout", function () {
    $scope.isLoggedIn = loginFactory.isLoggedIn();
    $scope.fullName = "";
  });

  $scope.logout = function (event) {
    loginFactory.logout();
  };

  function fetchFullName (id, callback) {
    $http.get("/api/user/" + id)
      .then(function (response) {
        callback(response.data.full_name);
      }, function (error) {
        console.log(error);
      });
  }

});