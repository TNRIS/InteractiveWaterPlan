'use strict';

angular.module('iswpApp')
  .service('YearService', function YearService() {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var service = {};
    service.currentYear = '';
    return service;
  });
