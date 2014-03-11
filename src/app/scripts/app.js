'use strict';

angular.module('iswpApp', [
  'iswpApp.config',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.router',
  'ui.bootstrap',
  'LocalStorageModule',
  'ngCrossfilter'
])
  .config(function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('iswp');
  })
  .run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  });
