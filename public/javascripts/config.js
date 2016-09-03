
var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html'/*,
       controller: 'queueCtrl'*/
    })
    .when('/share', {
      templateUrl: 'partials/share.html'/*,
      controller: 'queueCtrl'*/
    })
    .when('/profile', {
      templateUrl: 'partials/profile.html'/*,
      controller: 'queueCtrl'*/
    })
    .when('/user/:id', {
      templateUrl: 'partials/user.html'/*,
       controller: 'queueCtrl'*/
    })
    .otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});