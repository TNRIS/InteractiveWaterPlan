'use strict';

angular.module('iswpApp')
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    //redirect any bad/unmapped route to the beginning
    $urlRouterProvider
      .otherwise('/needs/2010/state');


    $stateProvider
      .state('needs', {
        abstract: false,
        url: '/needs',
        templateUrl: 'partials/needs.html',
        // //Resolves promises prior to loading the state
        // // seems pretty helpful
        // resolve: {
        //   needs: function(NeedsService) {
        //     return NeedsService.fetch();
        //   }
        // },
        controller: 'NeedsCtrl'

      })
      .state('needs.whatever', {
        url: '/:year/:area', // appended to /needs
        controller: 'TableCtrl',
        templateUrl: 'partials/needs_table.html'
      });

  });
