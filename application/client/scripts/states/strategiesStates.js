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
        },
        sources: /* ngInject */ function (StrategySourceService) {
          return StrategySourceService.fetch();
        }
      },
      controller: 'WrapCtrl',
      template: '<div ui-view></div>'
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
    .state('strategies.type', {
      url: '/:year/type/:entityType',
      resolve: strategiesResolver('type', 'entityType'),
      controller: 'StrategiesEntityTypeCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('strategies.entity', {
      url: '/:year/entity/:entityId',
      resolve: {
        strategiesData: /* @ngInject */ function (StrategiesService, $stateParams) {
          return StrategiesService.fetch('entity', $stateParams.entityId);
        },
        entitySummary: /* @ngInject */ function (EntityService, $stateParams) {
          return EntityService.fetchSummary($stateParams.entityId);
        }
      },
      controller: 'StrategiesEntityCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('strategies.source', {
      url: '/:year/source/:sourceId',
      resolve: strategiesResolver('source', 'sourceId'),
      controller: 'StrategiesSourceCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('strategies.wmstype', {
      url: '/:year/wmstype/:wmsType',
      resolve: strategiesResolver('wmstype', 'wmsType'),
      controller: 'StrategiesWmsTypeCtrl',
      templateUrl: 'templates/data_table.html'
    })
    ;

});
