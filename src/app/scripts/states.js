'use strict';

angular.module('iswpApp').config(
  function($stateProvider, $urlRouterProvider, $locationProvider, $uiViewScrollProvider) {
    //use html5 urls
    $locationProvider.html5Mode(true);

    //disable whacky auto-scroll behavior
    $uiViewScrollProvider.useAnchorScroll();

    //redirect any bad/unmapped route to the beginning
    $urlRouterProvider
      .otherwise('/needs/2010/state');


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
        templateUrl: 'partials/needs/needs_index.html',
        controller: 'NeedsCtrl'
      })
      .state('needs.summary', {
        url: '/:year/state', // appended to /needs
        resolve: needsResolver('summary'),
        controller: 'NeedsSummaryTableCtrl',
        templateUrl: 'partials/needs/needs_summary.html'
      })
      .state('needs.region', {
        url: '/:year/region/:region', // appended to /needs
        resolve: needsResolver('region', 'region'),
        controller: 'NeedsTableCtrl',
        templateUrl: 'partials/needs/needs_region.html'
      })
      .state('needs.county', {
        url: '/:year/county/:county', // appended to /needs
        resolve: needsResolver('county', 'county'),
        controller: 'NeedsTableCtrl',
        templateUrl: 'partials/needs/needs_county.html'
      })
      .state('needs.type', {
        url: '/:year/type/:entityType', // appended to /needs
        resolve: needsResolver('type', 'entityType'),
        controller: 'NeedsTableCtrl',
        templateUrl: 'partials/needs/needs_type.html'
      })
      .state('needs.entity', {
        url: '/:year/entity/:entityId', // appended to /needs
        resolve: needsResolver('entity', 'entityId'),
        controller: 'NeedsTableCtrl',
        templateUrl: 'partials/needs/needs_entity.html'
      });
  });
