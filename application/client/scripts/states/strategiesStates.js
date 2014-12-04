'use strict';

angular.module('iswpApp').config(function ($stateProvider) {

  var strategiesResolver = function (type, typeIdProperty) {
    return {
      strategiesData: /* @ngInject */ function (StrategiesService, $stateParams) {
        return StrategiesService.fetch(type, $stateParams[typeIdProperty]);
      }
    };
  };

  $stateProvider
    .state('strategies', {
      abstract: true,
      url: '/strategies',
      resolve: {
        entities: /* @ngInject */ function (EntityService) {
          return EntityService.fetch();
        }
      },
      controller: 'WrapCtrl',
      templateUrl: 'templates/main.html'
    })
    .state('strategies.summary', {
      url: '/:year/state',
      resolve: strategiesResolver('summary'),
      controller: 'StrategiesSummaryCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('strategies.region', {
      url: '/:year/region/:region',
      resolve: strategiesResolver('region', 'region'),
      controller: 'StrategiesRegionCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('strategies.county', {
      url: '/:year/county/:county',
      resolve: strategiesResolver('county', 'county'),
      controller: 'StrategiesCountyCtrl',
      templateUrl: 'templates/data_table.html'
    })
    ;

});
