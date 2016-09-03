
var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
       controller: 'homeCtrl'
    })
    .when('/find', {
      templateUrl: 'partials/find.html'
    })
    .when('/profile', {
      templateUrl: 'partials/profile.html'
    })
    .when('/user/:id', {
      templateUrl: 'partials/user.html'
    })
    .otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});