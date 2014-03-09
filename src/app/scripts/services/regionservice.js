'use strict';

//Service to indicate if the Water Planning Regions
// should be shown
angular.module('iswpApp')
  .service('RegionService', function RegionService() {
    var service = {};
    service.showRegions = false;

    return service;
  });
