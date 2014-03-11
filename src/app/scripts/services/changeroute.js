'use strict';

angular.module('iswpApp')
  .factory('$changeRoute', 
    function $changeRoute($routeParams, $route, $location) {
      return function(params) {
        params = angular.extend({}, $routeParams, params);
          
        var callback = function(all, name) {
          if (params[name]) {
            return params[name];
          }
          return '';
        };
        
        for (var path in $route.routes) {
          //TODO: Not ideal to be reading $$route
          if ($route.routes[path] === $route.current.$$route) {
            var url = path.replace(/:(\w+\??)/g, callback);
            $location.path(url);
            return;
          }
        }
      };
    }
  );