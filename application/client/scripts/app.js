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
  'LocalStorageModule'
])
  .config(function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('iswp');
  })
  .run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  });

//override pagination template from smartTable
// to place the "pagination" class on the <ul> element
angular.module("partials/pagination.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("partials/pagination.html",
    "<div class=\"pagination-container\">\n" +
    "  <ul class=\"pagination\">\n" +
    "    <li ng-repeat=\"page in pages\" ng-class=\"{active: page.active, disabled: page.disabled}\"><a\n" +
    "        ng-click=\"selectPage(page.number)\">{{page.text}}</a></li>\n" +
    "  </ul>\n" +
    "</div> ");
}]);

//override deafaultHeader tempalte from smartTable
// to use font-awesome icons to show sort order
angular.module("partials/defaultHeader.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("partials/defaultHeader.html",
    "<span class=\"header-content\">" +
    "  <i class=\"fa\" ng-class=\"{'fa-caret-up':column.reverse==true,'fa-caret-down':column.reverse==false}\"></i> "+
    "  {{column.label}}" +
    "</span>");
}]);
