'use strict';

/**
 * @ngdoc function
 * @name whiskeyApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the whiskeyApp
 */
angular.module('whiskeyApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
