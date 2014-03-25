'use strict';

angular.module('iswpApp')
  .config(function($stateProvider, $urlRouterProvider, $locationProvider,
    $uiViewScrollProvider, $anchorScrollProvider) {
      //don't use html5 urls because lack of support in IE (so sharing URLs will not work well)
      $locationProvider.html5Mode(false);

      //disable whacky auto-scroll behavior
      $uiViewScrollProvider.useAnchorScroll();
      $anchorScrollProvider.disableAutoScrolling();

      //redirect any bad/unmapped route to the beginning
      $urlRouterProvider.otherwise('/needs/2010/state');

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
          templateUrl: 'partials/needs/needs_index.html',
          controller: 'NeedsCtrl'
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
          templateUrl: 'partials/needs/needs_entity_view.html'
        });

        //TODO demands, supplies, wms (later phases)
    }
  )
  //Validation logic
  .run(function($rootScope, $state, $location, ISWP_VARS) {
    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams) {

      var doesntContain = function() {
        return !_.contains.apply(null, arguments);
      };

      var toHome = function() {
        $location.url('/');
        return;
      };

      if (doesntContain(ISWP_VARS.years, toParams.year)) {
        return toHome();
      }

      switch (toState.name) {
        case 'needs.region':
          if(doesntContain(ISWP_VARS.regions, toParams.region.toUpperCase())) {
            return toHome();
          }
          break;

        case 'needs.county':
          if(doesntContain(ISWP_VARS.counties,
              toParams.county.toUpperCase())) {
            return toHome();
          }
          break;

        case 'needs.type':
          if(doesntContain(ISWP_VARS.entityTypes,
              toParams.entityType.toUpperCase())) {
            return toHome();
          }
          break;
      }

    });
  });
