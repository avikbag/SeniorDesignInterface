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

    var dir = '/data/src.json';

    // Public API here
    return {
      fetch: function () {
        return $http.get(dir);
      }
    };
  });
