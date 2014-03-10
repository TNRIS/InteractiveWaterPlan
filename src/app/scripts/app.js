'use strict';

angular.module('iswpApp', [
  'iswpApp.config',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'ngCrossfilter'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/needs/:year/:area/:subtheme?', {
        templateUrl: 'partials/main',
        controller: 'NeedsCtrl',
        reloadOnSearch: false
      })
      //TODO: Other themes (demands, strategies, population, etc)
      .otherwise({
        // default to needs theme for 2010 decade
        redirectTo: '/needs/2010/state'
      });

    $locationProvider.html5Mode(false);
  });
