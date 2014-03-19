'use strict';

angular.module('iswpApp')
  .controller('NeedsCtrl',
    function ($scope, $rootScope, ISWP_VARS) {

      //TODO: route validation (maybe this should be done in states.js?)
      //See: http://angular-ui.github.io/ui-router/site/#/api/ui.router.router.$urlRouter


      // var validateRouteParams = function(evt, toState, toParams, fromState, fromParams) {
      //   console.log("validateRouteParams")

      //   var validAreas = ['state']
      //     .concat(ISWP_VARS.regions)
      //     .concat(ISWP_VARS.counties);

      //   // if (!_.contains(validAreas, $routeParams.area)) {
      //   //   evt.preventDefault();
      //   // }

      //   if (!_.contains(ISWP_VARS.years, toParams.year)) {
      //     evt.preventDefault();
      //   }
      //   //TODO: validate $routeParams.subtheme
      // };

      // //Validate routeParams, redirect when invalid
      // $scope.$on('$stateChangeStart', validateRouteParams);

      return;
    }
  );
