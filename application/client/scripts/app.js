'use strict';

//Just in case we leave in a console.log, this prevents IE9 from breaking
if (!window.console) {
  window.console = {};
  window.console.log = function() {};
}

angular.module('iswpApp', [
  'iswpApp.config',
  'iswpApp.templates',
  'Scope.safeApply',
  'ngCookies',
  'ngSanitize',
  'ngRoute',
  'smartTable.table',
  'ui.router',
  'ui.bootstrap',
  'ui.select2',
  'googlechart',
  'googleviz',
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

//Override of default popover template to allow bind-html-unsafe content
angular.module("template/popover/popover.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/popover/popover.html",
    "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    "  <div class=\"arrow\"></div>\n" +
    "\n" +
    "  <div class=\"popover-inner\">\n" +
    "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3>\n" +
    "      <div class=\"popover-content\" bind-html-unsafe=\"content\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
