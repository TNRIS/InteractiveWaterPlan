'use strict';

//Just in case we leave in a console.log, this prevents IE9 from breaking
if (!window.console) {
  window.console = {};
  window.console.log = angular.noop;
  window.console.error = angular.noop;
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
  'googlechart',
  'googleviz',
  'angulartics',
  'angulartics.google.analytics',
  'LocalStorageModule',
  'ui.select'
])
  .config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('iswp');
  })
  //override $anchorScroll to do nothing
  //  (because typically it will scroll the window to 0,0, which is annoying)
  .value('$anchorScroll', angular.noop)
  .config(function ($urlRouterProvider, $locationProvider, $uiViewScrollProvider) {
    //don't use html5 urls because lack of support in IE (so sharing URLs will not work well)
    $locationProvider.html5Mode(false);

    //tell angular-ui to use angular's anchorScroll provider, which has been
    // overridden above
    $uiViewScrollProvider.useAnchorScroll();

    //redirect any bad/unmapped route to the beginning
    $urlRouterProvider.otherwise('/demands/2010/state');
  })
  .run(function ($rootScope, $state, $stateParams, ISWP_VARS) {
    //convenience references to $state and $stateParams
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    //State validation logic
    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams) {

      var doesntContain = function() {
        return !_.contains.apply(null, arguments);
      };

      var toHome = function() {
        $rootScope.$state.go('needs.summary', {year: '2010'});
        return;
      };

      if (doesntContain(ISWP_VARS.years, toParams.year)) {
        return toHome();
      }

      var stateSuffix = _.last(toState.name.split('.'));

      switch (stateSuffix) {
        case 'region':
          if(doesntContain(ISWP_VARS.regions, toParams.region.toUpperCase())) {
            return toHome();
          }
          break;

        case 'county':
          if(doesntContain(ISWP_VARS.counties,
              toParams.county.toUpperCase())) {
            return toHome();
          }
          break;

        case 'type':
          if(doesntContain(ISWP_VARS.entityTypes,
              toParams.entityType.toUpperCase())) {
            return toHome();
          }
          break;
      }

    });
  });

//Override of default popover template to allow bind-html-unsafe content
angular.module("template/popover/popover.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("template/popover/popover.html",
    ["<div class='popover {{placement}}' ng-class='{ in: isOpen(), fade: animation() }'>",
      "<div class='arrow'></div>",
      "<div class='popover-inner'>",
        "<h3 class='popover-title' ng-bind='title' ng-show='title'></h3>",
        "<div class='popover-content' bind-html-unsafe='content'></div>",
      "</div>",
    "</div>"].join(""));
}]);
