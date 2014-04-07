'use strict';

angular.module('iswpApp')
  .config(function($stateProvider, $urlRouterProvider) {

      //redirect any bad/unmapped route to the beginning
      $urlRouterProvider.otherwise('/demands/2010/state');

      //-- NEEDS --
      var needsResolver = function(type, typeIdProperty) {
        return {
          needsData: function(NeedsService, $stateParams) {
            return NeedsService.fetch(type, $stateParams[typeIdProperty]);
          }
        };
      };

      $stateProvider
        .state('needs', {
          abstract: true,
          url: '/needs',
          resolve: {
            entities: function(EntityService) {
              return EntityService.fetch();
            }
          },
          template: '<div ui-view class="row"></div>'
        })
        .state('needs.summary', {
          url: '/:year/state', // appended to /needs
          resolve: needsResolver('summary'),
          controller: 'NeedsSummaryTableCtrl',
          templateUrl: 'partials/needs/needs_table.html'
        })
        .state('needs.region', {
          url: '/:year/region/:region', // appended to /needs
          resolve: needsResolver('region', 'region'),
          controller: 'NeedsRegionTableCtrl',
          templateUrl: 'partials/needs/needs_table.html'
        })
        .state('needs.county', {
          url: '/:year/county/:county', // appended to /needs
          resolve: needsResolver('county', 'county'),
          controller: 'NeedsCountyTableCtrl',
          templateUrl: 'partials/needs/needs_table.html'
        })
        .state('needs.type', {
          url: '/:year/type/:entityType', // appended to /needs
          resolve: needsResolver('type', 'entityType'),
          controller: 'NeedsEntityTypeTableCtrl',
          templateUrl: 'partials/needs/needs_table.html'
        })
        .state('needs.entity', {
          url: '/:year/entity/:entityId', // appended to /needs
          resolve: {
            needsData: function(NeedsService, $stateParams) {
              return NeedsService.fetch('entity', $stateParams.entityId);
            },
            entitySummary: function(EntityService, $stateParams) {
              return EntityService.fetchSummary($stateParams.entityId);
            }
          },
          controller: 'NeedsEntityTableCtrl',
          templateUrl: 'partials/needs/needs_table.html'
        });


      //-- DEMANDS --
      var demandsResolver = function(type, typeIdProperty) {
        return {
          demandsData: function(DemandsService, $stateParams) {
            return DemandsService.fetch(type, $stateParams[typeIdProperty]);
          }
        };
      };

      $stateProvider
        .state('demands', {
          abstract: true,
          url: '/demands',
          resolve: {
            entities: function(EntityService) {
              return EntityService.fetch();
            }
          },
          template: '<div ui-view class="row"></div>'
        })
        .state('demands.summary', {
          url: '/:year/state', // appended to /demands
          resolve: demandsResolver('summary'),
          controller: 'DemandsSummaryCtrl',
          templateUrl: 'partials/demands/demands_table.html'
        })
        .state('demands.region', {
          url: '/:year/region/:region', // appended to /demands
          resolve: demandsResolver('region', 'region'),
          controller: 'DemandsRegionCtrl',
          templateUrl: 'partials/demands/demands_table.html'
        })
        .state('demands.county', {
          url: '/:year/county/:county', // appended to /demands
          resolve: demandsResolver('county', 'county'),
          controller: 'DemandsCountyCtrl',
          templateUrl: 'partials/demands/demands_table.html'
        })
        .state('demands.type', {
          url: '/:year/type/:entityType', // appended to /demands
          resolve: demandsResolver('type', 'entityType'),
          controller: 'DemandsEntityTypeCtrl',
          templateUrl: 'partials/demands/demands_table.html'
        })
        .state('demands.entity', {
          url: '/:year/entity/:entityId', // appended to /demands
          resolve: {
            demandsData: function(DemandsService, $stateParams) {
              return DemandsService.fetch('entity', $stateParams.entityId);
            },
            entitySummary: function(EntityService, $stateParams) {
              return EntityService.fetchSummary($stateParams.entityId);
            }
          },
          controller: 'DemandsEntityCtrl',
          templateUrl: 'partials/demands/demands_table.html'
        });

        //TODO: states for supplies, wms (later phases)
    }
  )
  //Validation logic
  .run(function($rootScope, ISWP_VARS) {
    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams) {

      var doesntContain = function() {
        return !_.contains.apply(null, arguments);
      };

      var toHome = function() {
        $rootScope.$state.go('needs.summary', {year: '2010'});
        return;
      };

      if (doesntContain(ISWP_VARS.years, toParams.year)) {
        return toHome();
      }

      var stateSuffix = _.last(toState.name.split('.'));

      switch (stateSuffix) {
        case 'region':
          if(doesntContain(ISWP_VARS.regions, toParams.region.toUpperCase())) {
            return toHome();
          }
          break;

        case 'county':
          if(doesntContain(ISWP_VARS.counties,
              toParams.county.toUpperCase())) {
            return toHome();
          }
          break;

        case 'type':
          if(doesntContain(ISWP_VARS.entityTypes,
              toParams.entityType.toUpperCase())) {
            return toHome();
          }
          break;
      }

    });
  });
