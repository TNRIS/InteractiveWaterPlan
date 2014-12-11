'use strict';

angular.module('iswpApp').factory('HeadingService', function () {
  var service = {};

  service.current = "";

  service.get = function () {
    return service.current;
  };

  return service;
});
