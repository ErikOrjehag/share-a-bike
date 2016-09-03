
app.controller("mainCtrl", function ($scope, $location, loginFactory) {

  if (loginFactory.isLoggedIn() && $location.path() === "/") {
    $location.path("/find");
  }

});