'use strict';

/**
 * @ngdoc function
 * @name interfaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the interfaceApp
 */
angular.module('interfaceApp')
  .controller('MainCtrl', function ($scope, $http, stats) {
    /*
    var dir = "/src.json"
    stats.fetch(dir).then(function(msg){
      temp_keys = Object.keys(msg.data.op_class);
      $scope.labels = temp_keys;
      for(var i = 0; i < temp_keys.length -1 ; i++)
      {
        temp_vals.push(msg.data.op_class[temp_keys[i]]);
      }
      $scope.data = temp_vals;

    });
    */
    // Bar graph view for op code 
    $scope.job_labels = [];
    $scope.class_type = [];
    $scope.values = [];
    var checker = 0;
    var dir_template = "mockdata/job_output";
    for(var i = 0; i < 6 ; i++){
      $scope.job_labels.push("job"+i);
      stats.fetch(dir_template + i + ".json").then(function(msg){
        var data = msg.data.job_details.simulation_results.gem5.op_class;
        var keys = Object.keys(data);
        if ($scope.class_type.length == 0){
          // Initializing the series
          $scope.class_type.push.apply($scope.class_type, keys);
          for(var j = 0; j < $scope.class_type.length; j++){
            // Push an empty array, meaning a row, each corresponsing 
            // to the series, in other words, the classes
            $scope.values.push(Array(6).fill(-1));
          }
        } // End of initialization
        
        for(var j = 0; j < keys.length; j++){
          console.log(keys[j], data[keys[j]], j);
          $scope.values[j][checker] = data[keys[j]];
        }
      console.log($scope.values, $scope.class_type)
      console.log("Job"+checker+"done\n\n");
      checker += 1;
      });
    }
    
    // Radar view for op code 
    $scope.job_labelsRV = [];
    $scope.class_typeRV = [];
    $scope.valuesRV = [];
    var checkerRV = 0;
    var dir_template = "mockdata/job_output";
    for(var i = 0; i < 6 ; i++){
      $scope.class_typeRV.push("job"+i);
      stats.fetch(dir_template + i + ".json").then(function(msg){
        var data = msg.data.job_details.simulation_results.gem5.op_class;
        var keys = Object.keys(data);
        console.log(keys)
        if ($scope.job_labelsRV.length == 0){
          // Initializing the series
          $scope.job_labelsRV.push.apply($scope.job_labelsRV, keys);
          for(var j = 0; j < 6; j++){
            // Push an empty array, meaning a row, each corresponsing 
            // to the series, in other words, the classes
            console.log("cjdsflka")
            $scope.valuesRV.push(Array(7).fill(-1));
          }
        } // End of initialization
        
        for(var j = 0; j < keys.length; j++){
          console.log(keys[j], data[keys[j]], j);
          console.log($scope.valuesRV)
          $scope.valuesRV[checkerRV][j] = data[keys[j]];
        }
      console.log($scope.valuesRV, $scope.class_typeRV, $scope.job_labelsRV)
      console.log("Job"+checkerRV+"done\n\n");
      checkerRV += 1;
      });
    }
    $scope.options = {
            title: {
              display: true,
              text: 'Op Code Distribution for each job output'
            },
            legend: {
              display: true,
              position: "right",
              labels: {
                fontColor: 'rgb(0, 0, 0)'
              }
          }
    }
      
    
      
      
    // The tree map stuff.   
    $scope.formatName = (function() {
    return function(name) {
      return name;
      };
    })(this);
    $scope.onDetail = (function() {
      return function(node) {
        return console.log(node);
      };
    })(this);
    stats.fetch('/flare_with_color.json').success((function() {
      return function(data) {
        console.log(data);
        return $scope.tree = data;
      };
    })(this));
    return $scope.tree = {};


  });
