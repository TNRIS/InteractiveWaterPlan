'use strict';

angular.module('iswpApp')
  .filter('titleize', function() {
    return function(input) {
      return angular.isString(input) ? input.titleize() : '';
    };
  });
