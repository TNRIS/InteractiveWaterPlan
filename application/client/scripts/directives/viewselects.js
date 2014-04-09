'use strict';

//TODO: If mobile, just use regular <select> controls instead of select2
// How to check if mobile?

angular.module('iswpApp')
  .directive('viewSelects', function ($state, $stateParams, EntityService, ISWP_VARS) {
    return {
      restrict: 'A',
      templateUrl: 'templates/viewselects.html',
      controller: function ($scope, $element, $attrs) {


        $scope.entityTypes = ISWP_VARS.entityTypes;
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

        $scope.$watch('selectedType', function(type) {
          if (!type || type.isBlank()) {
            return;
          }

          var currentYear = $stateParams.year;
          var statePrefix = _.first($state.current.name.split('.'));

          if (type.toLowerCase() === 'summary') {
            $state.go(statePrefix + '.summary', {
              year: currentYear
            });
          }
          else {
            $state.go(statePrefix + '.type', {
              year: currentYear,
              entityType: type
            });
          }

          $scope.selectedType = '';
        });

        $scope.$watch('selectedRegion', function(region) {
          if (!region || region.isBlank()) {
            return;
          }

          var currentYear = $stateParams.year;
          var statePrefix = _.first($state.current.name.split('.'));

          $state.go(statePrefix + '.region', {
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
          var statePrefix = _.first($state.current.name.split('.'));

          $state.go(statePrefix + '.county', {
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
          var statePrefix = _.first($state.current.name.split('.'));

          $state.go(statePrefix + '.entity', {
            year: currentYear,
            entityId: entityId
          });

          $scope.selectedEntity = null;
        });
      }
    };
  });
