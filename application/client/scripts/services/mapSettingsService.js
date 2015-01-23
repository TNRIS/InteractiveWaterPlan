'use strict';

angular.module('iswpApp').factory('MapSettingsService', function () {
  var service = {};

  service.isMapLocked = false;
  service.isMapHidden = false;

  service.getIsMapLocked = function () {
    return service.isMapLocked;
  };

  service.getIsMapHidden = function () {
    return service.isMapHidden;
  };

  return service;
});
