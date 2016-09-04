
app.controller("homeCtrl", function ($scope, loginFactory) {

  var users = {
    "erik@orjehag.se": 1,
    "wille@sjoblom.se": 2,
    "bert@karlsson.se": 3,
    "jesus@gud.se": 4,
    "secret": 5,
    "kalle.anka@ankeborg.se": 6
  };

  $scope.login = function (event) {
    var id = users[$scope.email];
    if (id) {
      loginFactory.login(id);
    }
  };

});