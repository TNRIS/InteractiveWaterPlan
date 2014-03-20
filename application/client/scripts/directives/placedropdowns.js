'use strict';

angular.module('iswpApp')
  .directive('placeDropdowns', function (ISWP_VARS) {
    return {
      restrict: 'A',
      template: '<div class="area-select-container">' +
        '<p>Select an area or water user group from the following dropdowns:</p>' +
        '</div>',
      link: function postLink(scope, element, attrs, ctrl) {

        //TODO: Need autocomplete-by-name Entity service
        console.log("placeDropdowns", ISWP_VARS);

        var counties = ISWP_VARS.counties,
            regions = ISWP_VARS.regions;
      }
    };
  });
