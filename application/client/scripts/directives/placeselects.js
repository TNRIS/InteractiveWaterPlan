'use strict';

angular.module('iswpApp')
  .directive('placeSelects', function ($state, $stateParams, EntityService, ISWP_VARS) {
    return {
      restrict: 'A',
      templateUrl: 'partials/placeselects.html',
      controller: function ($scope, $element, $attrs) {

        $scope.counties = ISWP_VARS.counties;
        $scope.regions = ISWP_VARS.regions;


        $scope.entitySelectOpts = {
          minimumInputLength: 3,
          query: function(query) {
            EntityService.search(query.term)
              .then(function(entities) {
                var results = _.map(entities, function(e) {
                  return {
                    id: e.EntityId,
                    text: e.EntityName
                  };
                });

                query.callback({results: results});
              });

            $scope.$apply();
          },
          initSelection: function(el, callback) {
            callback(null);
          }
        };

        $scope.$watch('selectedRegion', function(region) {
          if (!region || region.isBlank()) {
            return;
          }

          var currentYear = $stateParams.year;

          $state.go('needs.region', {
            year: currentYear,
            region: region
          });

          $scope.selectedRegion = '';
        });

        $scope.$watch('selectedCounty', function(county) {
          if (!county || county.isBlank()) {
            return;
          }

          var currentYear = $stateParams.year;

          $state.go('needs.county', {
            year: currentYear,
            county: county
          });

          $scope.selectedCounty = '';
        });

        $scope.$watch('selectedEntity', function(entityId) {
          if (entityId === null || angular.isUndefined(entityId)) {
            return;
          }

          var currentYear = $stateParams.year;

          $state.go('needs.entity', {
            year: currentYear,
            entityId: entityId
          });

          $scope.selectedEntity = null;
        });
      }
    };
  });
