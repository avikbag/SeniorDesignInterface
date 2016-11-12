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

    // Public API here
    return {
      fetch: function (dir) {
        return $http.get(dir);
      }
    };
  });
