'use strict';

angular.module('iswpApp').config(function ($stateProvider) {

  var needsResolver = function(type, typeIdProperty) {
    return {
      needsData: /* @ngInject */ function(NeedsService, $stateParams) {
        return NeedsService.fetch(type, $stateParams[typeIdProperty]);
      }
    };
  };

  $stateProvider
    .state('needs', {
      abstract: true,
      url: '/needs',
      resolve: {
        entities: /* @ngInject */ function (EntityService) {
          return EntityService.fetch();
        }
      },
      controller: 'WrapCtrl',
      templateUrl: 'templates/main.html'
    })
    .state('needs.summary', {
      url: '/:year/state', // appended to /needs
      resolve: needsResolver('summary'),
      controller: 'NeedsSummaryTableCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('needs.region', {
      url: '/:year/region/:region', // appended to /needs
      resolve: needsResolver('region', 'region'),
      controller: 'NeedsRegionTableCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('needs.county', {
      url: '/:year/county/:county', // appended to /needs
      resolve: needsResolver('county', 'county'),
      controller: 'NeedsCountyTableCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('needs.type', {
      url: '/:year/type/:entityType', // appended to /needs
      resolve: needsResolver('type', 'entityType'),
      controller: 'NeedsEntityTypeTableCtrl',
      templateUrl: 'templates/data_table.html'
    })
    .state('needs.entity', {
      url: '/:year/entity/:entityId', // appended to /needs
      resolve: {
        needsData: /* @ngInject */ function(NeedsService, $stateParams) {
          return NeedsService.fetch('entity', $stateParams.entityId);
        },
        entitySummary: /* @ngInject */ function(EntityService, $stateParams) {
          return EntityService.fetchSummary($stateParams.entityId);
        }
      },
      controller: 'NeedsEntityTableCtrl',
      templateUrl: 'templates/data_table.html'
    });

});
