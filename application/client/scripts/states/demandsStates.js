'use strict';

angular.module('iswpApp').config(function ($stateProvider) {
  var demandsResolver = function(type, typeIdProperty) {
    return {
      demandsData: /* @ngInject */ function (DemandsService, $stateParams) {
        return DemandsService.fetch(type, $stateParams[typeIdProperty]);
      }
    };
  };

  $stateProvider
    .state('demands', {
      abstract: true,
      url: '/demands',
      resolve: {
        entities: /* @ngInject */ function (EntityService) {
          return EntityService.fetch();
        }
      },
      controller: 'WrapCtrl',
      templateUrl: 'templates/main.html'
    })
    .state('demands.summary', {
      url: '/:year/state', // appended to /demands
      resolve: demandsResolver('summary'),
      controller: 'DemandsSummaryCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('demands.region', {
      url: '/:year/region/:region', // appended to /demands
      resolve: demandsResolver('region', 'region'),
      controller: 'DemandsRegionCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('demands.county', {
      url: '/:year/county/:county', // appended to /demands
      resolve: demandsResolver('county', 'county'),
      controller: 'DemandsCountyCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('demands.type', {
      url: '/:year/type/:entityType', // appended to /demands
      resolve: demandsResolver('type', 'entityType'),
      controller: 'DemandsEntityTypeCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('demands.entity', {
      url: '/:year/entity/:entityId', // appended to /demands
      resolve: {
        demandsData: /* @ngInject */ function (DemandsService, $stateParams) {
          return DemandsService.fetch('entity', $stateParams.entityId);
        },
        entitySummary: /* @ngInject */ function (EntityService, $stateParams) {
          return EntityService.fetchSummary($stateParams.entityId);
        }
      },
      controller: 'DemandsEntityCtrl',
      templateUrl: 'templates/data_table.html'
    });

});
