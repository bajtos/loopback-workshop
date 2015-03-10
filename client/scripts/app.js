'use strict';

/**
 * @ngdoc overview
 * @name whiskeyApp
 * @description
 * # whiskeyApp
 *
 * Main module of the application.
 */
angular
  .module('whiskeyApp', [
    'ngResource',
    'ngRoute',
    'lbServices'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/details/:id', {
        templateUrl: 'views/details.html',
        controller: 'DetailsCtrl'
      })
      .when('/review/:id', {
        templateUrl: 'views/review.html',
        controller: 'ReviewCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
