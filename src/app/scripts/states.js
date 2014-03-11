'use strict';

angular.module('iswpApp')
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    //redirect any bad/unmapped route to the beginning
    $urlRouterProvider
      .otherwise('/needs/2010/state');


    $stateProvider
      .state('needs', {
        abstract: true,
        url: '/needs',
        templateUrl: 'partials/needs/needs_index.html',
        // //Resolves promises prior to loading the state
        // // seems pretty helpful
        // resolve: {
        //   needs: function(NeedsService) {
        //     return NeedsService.fetch();
        //   }
        // },
        controller: 'NeedsCtrl'

      })
      .state('needs.summary', {
        url: '/:year/state', // appended to /needs
        controller: 'TableCtrl',
        templateUrl: 'partials/needs/needs_summary.html'
      })
      .state('needs.region', {
        url: '/:year/region/:region', // appended to /needs
        controller: 'TableCtrl',
        templateUrl: 'partials/needs/needs_region.html'
      })
      .state('needs.county', {
        url: '/:year/county/:county', // appended to /needs
        controller: 'TableCtrl',
        templateUrl: 'partials/needs/needs_county.html'
      })
      .state('needs.entity', {
        url: '/:year/entity/:entityId', // appended to /needs
        controller: 'TableCtrl',
        templateUrl: 'partials/needs/needs_entity.html'
      });

  });
