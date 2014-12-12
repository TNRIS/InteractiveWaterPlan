'use strict';

angular.module('iswpApp').config(function ($stateProvider) {

  var suppliesResolver = function (type, typeIdProperty) {
    return {
      suppliesData: /* @ngInject */ function (SuppliesService, $stateParams) {
        return SuppliesService.fetch(type, $stateParams[typeIdProperty]);
      }
    };
  };

  $stateProvider
    .state('supplies', {
      abstract: true,
      url: '/supplies',
      resolve: {
        entities: /* @ngInject */ function (EntityService) {
          return EntityService.fetch();
        },
        sources: /* ngInject */ function (SupplySourceService) {
          return SupplySourceService.fetch();
        }
      },
      controller: 'WrapCtrl',
      templateUrl: 'templates/main.html'
    })
    .state('supplies.summary', {
      url: '/:year/state',
      resolve: suppliesResolver('summary'),
      controller: 'SuppliesSummaryCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('supplies.region', {
      url: '/:year/region/:region',
      resolve: suppliesResolver('region', 'region'),
      controller: 'SuppliesRegionCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('supplies.county', {
      url: '/:year/county/:county',
      resolve: suppliesResolver('county', 'county'),
      controller: 'SuppliesCountyCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('supplies.type', {
      url: '/:year/type/:entityType',
      resolve: suppliesResolver('type', 'entityType'),
      controller: 'SuppliesEntityTypeCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('supplies.entity', {
      url: '/:year/entity/:entityId',
      resolve: {
        suppliesData: /* @ngInject */ function (SuppliesService, $stateParams) {
          return SuppliesService.fetch('entity', $stateParams.entityId);
        },
        entitySummary: /* @ngInject */ function (EntityService, $stateParams) {
          return EntityService.fetchSummary($stateParams.entityId);
        }
      },
      controller: 'SuppliesEntityCtrl',
      templateUrl: 'templates/data_table.html'
    })
    // .state('supplies.source', {
    //   url: '/:year/source/:sourceId',
    //   resolve: suppliesResolver('source', 'sourceId'),
    //   controller: 'SuppliesSourceCtrl',
    //   templateUrl: 'templates/data_table.html'
    // })
    ;

});
