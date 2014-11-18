'use strict';

//TODO: If mobile, just use regular <select> controls instead of select2
// How to check if mobile?

angular.module('iswpApp')
  .directive('viewSelects', function ($state, $stateParams, EntityService, ISWP_VARS) {
    return {
      restrict: 'A',
      templateUrl: 'templates/viewselects.html',
      controller: function ($scope, $element, $attrs) {

        $scope.entityTypes = _.map(ISWP_VARS.entityTypes, function (t, i) {
          return {value: t, text: t.titleize(), '$order': i+1};
        });
        $scope.entityTypes.unshift({value: 'summary', text: 'Regional Summary', '$order': 0});
        $scope.typeSelectOptions = {
          maxItems: 1,
          placeholder: 'Select a Water User Type'
        };

        $scope.counties = _.map(ISWP_VARS.counties, function (c) {
          return {value: c, text: c.titleize()};
        });
        $scope.countySelectOptions = {
          maxItems: 1,
          sortField: 'text',
          placeholder: 'Select a County'
        };

        $scope.regions = _.map(ISWP_VARS.regions, function (r) {
          return {value: r, text: "Region " + r};
        });
        $scope.regionSelectOptions = {
          maxItems: 1,
          sortField: 'text',
          placeholder: "Select a Region"
        };

        $scope.entitySelectOptions = {
          maxItems: 1,
          sortField: 'text',
          placeholder: "Find an Entity",
          load: function (query, cb) {
            if (!query || query.length < 3) { return cb(); }
            EntityService.search(query)
              .then(function(entities) {
                var results = _.map(entities, function(e) {
                  return {
                    value: e.EntityId,
                    text: e.EntityName
                  };
                });

                cb(results);
              });

            $scope.$apply();
          }
        };

        //TODO: delete
        // $scope.entitySelectOpts = {
        //   minimumInputLength: 3,
        //   query: function(query) {
        //     EntityService.search(query.term)
        //       .then(function(entities) {
        //         var results = _.map(entities, function(e) {
        //           return {
        //             id: e.EntityId,
        //             text: e.EntityName
        //           };
        //         });

        //         query.callback({results: results});
        //       });

        //     $scope.$apply();
        //   },
        //   initSelection: function(el, callback) {
        //     callback(null);
        //   }
        // };

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

          $scope.selectedType = null;
        });

        $scope.$watch('selectedRegion', function (region) {
          if (!region || region.isBlank()) {
            return;
          }

          var currentYear = $stateParams.year;
          var statePrefix = _.first($state.current.name.split('.'));

          $state.go(statePrefix + '.region', {
            year: currentYear,
            region: region
          });

          $scope.selectedRegion = null;
        });

        $scope.$watch('selectedCounty', function (county) {
          if (!county || county.isBlank()) {
            return;
          }

          var currentYear = $stateParams.year;
          var statePrefix = _.first($state.current.name.split('.'));

          $state.go(statePrefix + '.county', {
            year: currentYear,
            county: county
          });

          $scope.selectedCounty = null;
        });

        $scope.$watch('selectedEntity', function (entityId) {

          if (entityId === null || _.isEmpty(entityId)) {
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
