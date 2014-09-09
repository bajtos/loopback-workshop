'use strict';

/**
 * @ngdoc function
 * @name whiskeyApp.controller:ReviewCtrl
 * @description
 * # ReviewCtrl
 * Controller of the whiskeyApp
 */
angular.module('whiskeyApp')
  .controller('ReviewCtrl', function ($scope, $routeParams, $location, Review) {
    var whiskeyId = $routeParams.id;

    $scope.data = {
      whiskeyId: whiskeyId,
      rating: 5,
      comment: ''
    };

    $scope.submit = function() {
      // TODO create a new review using $scope.data
      // Redirect back to the details page when done:
      //   $location.path('/details/' + whiskeyId);
    };
  });
