'use strict';

angular.module('iswpApp')
  .factory('TableSettingsService', function (localStorageService) {

    var service = {};
    service.getItemsPerPage = function () {
      return localStorageService.get('tableItemsPerPage') || 20;
    };

    service.setItemsPerPage = function (num) {
      localStorageService.set('tableItemsPerPage', num);
    };

    return service;
  });
