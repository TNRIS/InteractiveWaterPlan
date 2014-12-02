'use strict';

angular.module('iswpApp')
  .filter('titleize', function() {
    return function(input) {
      return angular.isString(input) ? input.titleize() : '';
    };
  })
  //Like ui-router's isState, but checks if is child state
  .filter('isChildState', function($state) {
    return function(state) {
      var parent = $state.current.name.split('.')[0];
      return $state.is(parent + '.' + state);
    };
  })
  ;
