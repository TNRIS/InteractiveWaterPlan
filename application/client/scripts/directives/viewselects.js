'use strict';

angular.module('iswpApp')
  .directive('viewSelects', function ($state, $stateParams, EntityService, ISWP_VARS) {
    return {
      restrict: 'A',
      templateUrl: 'templates/viewselects.html',
      controller: function ($scope, $element, $attrs) {

        //TODO: Put in constants?
        $scope.viewTypes = [
          {text: 'Regional Summary', value: 'summary', showSub: false},
          {text: 'Usage Type', value: 'type', showSub: true},
          {text: 'Region', value: 'region', showSub: true},
          {text: 'County', value: 'county', showSub: true},
          {text: 'Water User Group', value: 'entity', showSub: true},
        ];

        $scope.region = {};
        $scope.county = {};
        $scope.type = {};
        $scope.entity = {};

        var resetSelected = function () {
          $scope.region = {};
          $scope.county = {};
          $scope.type = {};
          $scope.entity = {};
        };

        //grab selectedViewType from route
        var currViewValue = $state.current.name.split('.')[1];
        $scope.selectedViewType = _.find($scope.viewTypes, {value: currViewValue});

        $scope.entityTypes = _.map(ISWP_VARS.entityTypes, function (t, i) {
          return {value: t, text: t.titleize()};
        });

        $scope.counties = _.map(ISWP_VARS.counties, function (c) {
          return {value: c, text: c.titleize()};
        });

        $scope.regions = _.map(ISWP_VARS.regions, function (r) {
          return {value: r, text: "Region " + r};
        });


        $scope.loadEntities = function(query) {

          if (!query || query.length < 3) {
            $scope.entities = [];
            return;
          }
          EntityService.search(query)
            .then(function(entities) {
              var results = _.map(entities, function(e) {
                return {
                  value: e.EntityId,
                  text: e.EntityName
                };
              });
              $scope.entities = results;
            });

        };

        $scope.$watch('selectedViewType', function (selected) {
          if (!selected) { return; }

          if (selected.value === 'summary') {
            var currentYear = $stateParams.year;
            var statePrefix = _.first($state.current.name.split('.'));

            $state.go(statePrefix + '.summary', {
              year: currentYear
            });
          }

          resetSelected();
        });


        $scope.$watch('type.selected', function (type) {
          if (!type) { return; }

          var currentYear = $stateParams.year;
          var statePrefix = _.first($state.current.name.split('.'));

          $state.go(statePrefix + '.type', {
            year: currentYear,
            entityType: type.value
          });

          // $scope.selectedType = null;
        });

        $scope.$watch('region.selected', function (region) {
          if (!region) { return; }

          var currentYear = $stateParams.year;
          var statePrefix = _.first($state.current.name.split('.'));

          $state.go(statePrefix + '.region', {
            year: currentYear,
            region: region.value
          });

          // $scope.selectedRegion = null;
        });

        $scope.$watch('county.selected', function (county) {
          if (!county) { return; }

          var currentYear = $stateParams.year;
          var statePrefix = _.first($state.current.name.split('.'));

          $state.go(statePrefix + '.county', {
            year: currentYear,
            county: county.value
          });

          // $scope.selectedCounty = null;
        });

        $scope.$watch('entity.selected', function (entity) {
          if (!entity) { return; }

          var currentYear = $stateParams.year;
          var statePrefix = _.first($state.current.name.split('.'));

          $state.go(statePrefix + '.entity', {
            year: currentYear,
            entityId: entity.value
          });

          // $scope.selectedEntity = null;
        });
      }
    };
  });
