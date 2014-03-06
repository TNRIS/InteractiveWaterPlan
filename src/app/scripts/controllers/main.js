'use strict';

angular.module('iswpApp')
  .controller('MainCtrl', function ($scope, $http, $routeParams, ROUTE_DEFAULTS) {

    var routeParams = angular.extend({}, ROUTE_DEFAULTS, $routeParams);

    console.log("routeParams", routeParams);

    return;

  });
