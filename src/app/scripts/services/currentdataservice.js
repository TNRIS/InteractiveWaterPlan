'use strict';

//Service to hold the data of the current theme
angular.module('iswpApp')
  .service('CurrentDataService', function CurrentDataService() {
    var service = {};

    service.data = [];

    return service;
  });
