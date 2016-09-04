
var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
       controller: 'homeCtrl'
    })
    .when('/find', {
      templateUrl: 'partials/find.html',
      controller: 'findCtrl'
    })
    .when('/profile', {
      templateUrl: 'partials/profile.html',
      controller: 'profileCtrl'
    })
    .when('/user/:id', {
      templateUrl: 'partials/user.html'
    })
    .when('/bike/:id', {
      templateUrl: 'partials/bike.html',
      controller: 'bikeCtrl'
    })
    .when('/control', {
      templateUrl: 'partials/control.html',
      controller: 'controlCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});