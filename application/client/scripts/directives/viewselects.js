'use strict';

angular.module('iswpApp').directive('viewSelects',
  function ($state, $stateParams, EntityService, StrategySourceService, StrategiesService, ISWP_VARS) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'templates/viewselects.html',
      controller: function ($scope) {

        function resetSelected() {
          $scope.region = {};
          $scope.county = {};
          $scope.type = {};
          $scope.entity = {};
          $scope.source = {};
          $scope.wmstype = {};
        }

        resetSelected(); //call on init

        function setupViewTypes() {
          $scope.viewTypes = [
            {text: 'Regional Summary', value: 'summary', showSub: false},
            {text: 'Usage Type', value: 'type', showSub: true},
            {text: 'Region', value: 'region', showSub: true},
            {text: 'County', value: 'county', showSub: true},
            {text: 'Water User Group', value: 'entity', showSub: true}
          ];

          if ($state.includes('strategies') || $state.includes('supplies')) {
            $scope.viewTypes.push(
              {text: 'Water Source', value: 'source', showSub: true}
            );
          }

          if ($state.includes('strategies')) {
            $scope.viewTypes.push(
              {text: 'Type of Strategy', value: 'wmstype', showSub: true}
            );
          }
        }

        setupViewTypes();
        $scope.$on('$stateChangeSuccess', setupViewTypes);


        function setToCurrentState() {
          //grab selectedViewType from route
          var currViewValue = $state.current.name.split('.')[1];
          $scope.selectedViewType = _.find($scope.viewTypes, {value: currViewValue});
        }

        setToCurrentState(); //run at start
        $scope.$on('$stateChangeSuccess', setToCurrentState);

        $scope.entityTypes = _.map(ISWP_VARS.entityTypes, function (t) {
          return {value: t, text: t.titleize()};
        });

        $scope.counties = _.map(ISWP_VARS.counties, function (c) {
          return {value: c, text: c.titleize()};
        });

        $scope.regions = _.map(ISWP_VARS.regions, function (r) {
          return {value: r, text: "Region " + r};
        });


        $scope.$on('$stateChangeSuccess', function () {
          if ($state.includes('strategies')) {
            $scope.sources = _.map(ISWP_VARS.strategySources, function (s) {
              return {value: s.MapSourceId, text: s.SourceName};
            });
            $scope.wmsTypes = _.map(ISWP_VARS.wmsTypes, function (t) {
              return {value: t, text: t};
            });
          }
          else if ($state.includes('supplies')) {
            $scope.sources = _.map(ISWP_VARS.existingSources, function (s) {
              return {value: s.MapSourceId, text: s.SourceName};
            });
          }
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


        function goToView (childName, childParam) {
          var currentYear = $stateParams.year;
          var statePrefix = _.first($state.current.name.split('.'));

          $state.go(statePrefix + '.' + childName,
            _.extend({year: currentYear}, childParam)
          );
        }

        $scope.selectType = function (selected) {
          goToView('type', {entityType: selected.value});
        };

        $scope.selectRegion = function (selected) {
          goToView('region', {region: selected.value});
        };

        $scope.selectCounty = function (selected) {
          goToView('county', {county: selected.value});
        };

        $scope.selectEntity = function (selected) {
          goToView('entity', {entityId: selected.value});
        };

        $scope.selectSource = function (selected) {
          goToView('source', {sourceId: selected.value});
        };

        $scope.selectWmsType = function (selected) {
          goToView('wmstype', {wmsType: selected.value});
        };

      }
    };
  });
