'use strict';

/**
 * @ngdoc function
 * @name interfaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the interfaceApp
 */
angular.module('interfaceApp')
  .controller('MainCtrl', function ($scope, $http, $mdSidenav, stats, Upload) {
    // adding test upload using ng upload
    
    

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
    // Bar graph view for op code/execution time.
    $scope.job_labels = [];
    $scope.class_type = [];
    $scope.values = [];
    $scope.execTimes = [];
    $scope.area = [];
    $scope.power = [[], []];
    $scope.powerSeries = ["Dynamic read energy (nJ)", "Dynamic write energy (nJ)"]
    var checker = 0;
    var dir_template = "mockdata/job_output";
    

    var testUrl = 'https://s3-us-west-2.amazonaws.com/archeval/job_outputM.json'
    console.log("in controller " + test);
    stats.fetch(testUrl).then(function(msg){
      console.log(msg);
    });

    $scope.reader = function(){
      console.log($scope.file);
			getSignedRequest(file)
    }

    var getSignedRequest = function(file){
     	const xhr = new XMLHttpRequest();
  		xhr.open('GET', '/sign-s3?file-name=${file.name}&file-type=${file.type}');
  		xhr.onreadystatechange = function() {
    	if(xhr.readyState === 4){
      	if(xhr.status === 200){
        	const response = JSON.parse(xhr.responseText);
          console.log("This part works angularized")
        	//uploadFile(file, response.signedRequest, response.url);
      	  }
      	else{
        	alert('Could not get signed URL.');
      	  }
    	  } 
  	  };
      xhr.send();
    }

    $scope.info = [];
    for(var i = 0; i < 6 ; i++){
      $scope.job_labels.push("job"+i);
      stats.fetch(dir_template + i + ".json").then(function(msg){
        var data = msg.data.job_details.simulation_results.gem5.op_class;
        $scope.execTimes.push(msg.data.job_details.simulation_results.gem5["execution time (s)"]);
        $scope.area.push(msg.data.job_details.simulation_results.mcpat["Area (mm2)"]);
        $scope.power[0].push(msg.data.job_details.simulation_results.mcpat["Dynamic read energy (nJ)"]);
        $scope.power[1].push(msg.data.job_details.simulation_results.mcpat["Dynamic write energy (nJ)"]);
        var keys = Object.keys(data);
        // Adding job info to list
        delete msg.data.job_details["simulation_results"];
        $scope.info.push(msg);
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
          //console.log(keys[j], data[keys[j]], j);
          $scope.values[j][checker] = data[keys[j]];
        }
      //console.log($scope.values, $scope.class_type, $scope.execTimes);
      //console.log("Job"+checker+"done\n\n");
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
        //console.log(keys)
        if ($scope.job_labelsRV.length == 0){
          // Initializing the series
          $scope.job_labelsRV.push.apply($scope.job_labelsRV, keys);
          $scope.job_labelsRV.pop();
          for(var j = 0; j < 6; j++){
            // Push an empty array, meaning a row, each corresponsing 
            // to the series, in other words, the classes
            //console.log("cjdsflka")
            $scope.valuesRV.push(Array(6).fill(-1));
          }
        } // End of initialization
        
        for(var j = 0; j < keys.length - 1; j++){
          //console.log(keys[j], data[keys[j]], j);
          //console.log($scope.valuesRV)
          $scope.valuesRV[checkerRV][j] = data[keys[j]];
        }
      //console.log($scope.valuesRV, $scope.class_typeRV, $scope.job_labelsRV)
      //console.log("Job"+checkerRV+"done\n\n");
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
            }, 
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Instruction count'
                  }
              }]
            }
    }
    $scope.optionsPow = {
            title: {
              display: true,
              text: 'McPat power analysis from job outputs'
            },
            legend: {
              display: true,
              position: "right",
              labels: {
                fontColor: 'rgb(0, 0, 0)'
              }
            }, 
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Power output in nJ'
                  }
              }]
            }
    }
    $scope.optionsrv = {
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
    $scope.options1 = {
            title: {
              display: true,
              text: 'Op Code Distribution for each job output {0}'
            },
            legend: {
              display: true,
              position: "right",
              labels: {
                fontColor: 'rgb(0, 0, 0)'
              }
          }
    }
    $scope.options2 = {
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
    $scope.options3 = {
            title: {
              display: true,
              text: 'Execution Time for each job output'
            },
            legend: {
              display: false,
              position: "right",
              labels: {
                fontColor: 'rgb(0, 0, 0)'
              }
            },
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Execution time in seconds'
                  }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Job execution iteration'
                  }
              }]
            }
    }
    $scope.optionsrv = {
            title: {
              display: true,
              text: 'Area mm2'
            },
            legend: {
              display: true,
              position: "right",
              labels: {
                fontColor: 'rgb(0, 0, 0)'
              }
            }
    }
      
    
    
    $scope.graphic = 0;
    $scope.job0 = 0;
    $scope.job1 = 1;
    
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      }
    }
      


  });
