'use strict';

angular.module('iswpApp').config(function ($stateProvider) {



  $stateProvider
    .state('strategies', {
      abstract: true,
      url: '/strategies',
      resolve: {
        entities: /* @ngInject */ function (EntityService) {
          return EntityService.fetch();
        }
      },
      templateUrl: 'templates/main.html'
    })
    .state('strategies.summary', {
      url: '/:year/state',
      controller: 'StrategiesSummaryCtrl',
      templateUrl: 'templates/strategies/strategies_table.html'
    });

});
