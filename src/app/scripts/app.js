'use strict';

angular.module('iswpApp', [
  'iswpApp.config',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngTable',
  'ui.router',
  'ui.bootstrap',
  'LocalStorageModule'
])
  .config(function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('iswp');
  })
  .run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  });
