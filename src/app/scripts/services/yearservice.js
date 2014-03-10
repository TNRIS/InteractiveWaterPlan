'use strict';

angular.module('iswpApp')
  .service('YearService', function YearService() {
    var currentYear;
    var service = {};

    service.getCurrentYear = function() {
      return currentYear;
    };

    service.setCurrentYear = function(year) {
      currentYear = year;
    };

    return service;
  });
