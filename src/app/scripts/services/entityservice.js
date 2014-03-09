'use strict';

//Service to hold current Water User Group Entities
// to be show on the map
angular.module('iswpApp')
  .service('EntityService', function EntityService() {
    var service = {};
    service.entities = [];

    return service;
  });
