'use strict';

angular.module('iswpApp')
  .directive('placeSelects', function ($state, $stateParams, ISWP_VARS) {
    return {
      restrict: 'A',
      templateUrl: 'partials/placeselects.html',
      link: function postLink(scope, element, attrs, ctrl) {

        //TODO: Need autocomplete-by-name Entity service

        scope.counties = ISWP_VARS.counties;
        scope.regions = ISWP_VARS.regions;

        scope.$watch('selectedRegion', function(region) {
          if (!region || region.isBlank()) {
            return;
          }

          var currentYear = $stateParams.year;

          $state.go('needs.region', {
            year: currentYear,
            region: region
          });

          scope.selectedRegion = '';
        });

        scope.$watch('selectedCounty', function(county) {
          if (!county || county.isBlank()) {
            return;
          }

          var currentYear = $stateParams.year;

          $state.go('needs.county', {
            year: currentYear,
            county: county
          });

          scope.selectedCounty = '';
        });
      }
    };
  });
