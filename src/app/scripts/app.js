'use strict';

angular.module('iswpApp', [
  'iswpApp.config',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/needs/:year/:subtheme?/:area?', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      //TODO: Other themes (demands, strategies, population, etc)
      .otherwise({
        // default to needs theme for 2010 decade
        redirectTo: '/needs/2010'
      });

    $locationProvider.html5Mode(false);
  });
