'use strict';

/**
 * @ngdoc function
 * @name interfaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the interfaceApp
 */
angular.module('interfaceApp')
  .controller('MainCtrl', function ($scope, stats) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var temp_keys = [];
    var temp_vals = [];
    stats.fetch().then(function(msg){
      temp_keys = Object.keys(msg.data.op_class);
      $scope.labels = temp_keys;
      for(var i = 0; i < temp_keys.length -1 ; i++)
      {
        temp_vals.push(msg.data.op_class[temp_keys[i]]);
      }
      $scope.data = temp_vals;

    });
    

    //$scope.labels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
    //$scope.data = [300, 500, 100];

  });
