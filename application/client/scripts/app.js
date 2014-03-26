'use strict';

//Just in case we leave in a console.log, this prevents IE9 from breaking
if (!window.console) {
  window.console = {};
  window.console.log = function() {};
}

angular.module('iswpApp', [
  'iswpApp.config',
  'ngCookies',
  'ngSanitize',
  'ngRoute',
  'smartTable.table',
  'ui.router',
  'ui.bootstrap',
  'ui.select2',
  'googlechart',
  'angulartics',
  'angulartics.google.analytics',
  'LocalStorageModule'
])
  .config(function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('iswp');
  })
  //override $anchorScroll to do nothing
  //  (because typically it will scroll the window to 0,0, which is annoying)
  .value('$anchorScroll', angular.noop)
  .config(function($locationProvider, $uiViewScrollProvider) {
    //don't use html5 urls because lack of support in IE (so sharing URLs will not work well)
    $locationProvider.html5Mode(false);

    //tell angular-ui to use angular's anchorScroll provider, which has been
    // overridden above
    $uiViewScrollProvider.useAnchorScroll();
  })
  .run(function($rootScope, $state, $stateParams) {
    //convenience references to $state and $stateParams
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  });
