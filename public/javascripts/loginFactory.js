
app.factory("loginFactory", function ($rootScope, $location, $http) {

  var fac = {};

  fac.login = function (id) {
    sessionStorage.setItem("user_id", id);
    $rootScope.$broadcast("login");
    $location.path("/find");
  };

  fac.logout = function (id) {
    sessionStorage.removeItem("user_id");
    $rootScope.$broadcast("logout");
    $location.path("/");
  };

  fac.isLoggedIn = function () {
    return !!sessionStorage.getItem("user_id");
  };

  fac.getUserId = function () {
    return sessionStorage.getItem("user_id");
  };

  return fac;

});