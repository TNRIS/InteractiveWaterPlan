'use strict';

angular.module('iswpApp')
  .service('NeedsService', function NeedsService($http, API_PATH) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var service = {};

    service.needs = [];

    service.fetch = function() {
      var prom = $http.get(API_PATH + 'needs', {cache: true})
        .success(function(data) {
          angular.copy(data, service.needs);
        });

      return prom;
    };

    return service;
  });
