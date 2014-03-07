'use strict';

angular.module('iswpApp')
  .controller('MainCtrl',
    function ($scope, $http, $routeParams, PlacesService, NeedsService) {

      PlacesService.fetch();
      NeedsService.fetch();

      console.log("MainCtrl $routeParams", $routeParams);

      return;
    }
  );
