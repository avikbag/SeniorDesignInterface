'use strict';

/**
 * @ngdoc service
 * @name interfaceApp.stats
 * @description
 * # stats
 * Factory in the interfaceApp.
 */
angular.module('interfaceApp')
  .factory('stats', function ($http) {

    var dir = 'src.json';

    // Public API here
    return {
      fetch: function () {
        return $http.get(dir);
      }
    };
  });
