
app.controller("homeCtrl", function ($scope, loginFactory) {

  var users = {
    "erik@orjehag.se": 1,
    "wille@sjoblom.se": 2
  };

  $scope.login = function (event) {
    var id = users[$scope.email];
    if (id) {
      loginFactory.login(id);
    }
  };

});