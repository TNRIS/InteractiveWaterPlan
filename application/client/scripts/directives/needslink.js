'use strict';

angular.module('iswpApp')
  .directive('needsLink', function ($state, $stateParams) {
    var paramsMap = {
      'EntityName': {
        paramField: 'EntityId',
        stateParam: 'entityId',
        stateName: 'needs.entity'
      },
      'WugRegion': {
        paramField: 'WugRegion',
        stateParam: 'region',
        stateName: 'needs.region'
      },
      'WugCounty': {
        paramField: 'WugCounty',
        stateParam: 'county',
        stateName: 'needs.county'
      },
      'WugType': {
        paramField: 'WugType',
        stateParam: 'entityType',
        stateName: 'needs.type'
      },
    };

    //TODO: Might be better to use ui-sref instead of ng-click handling
    return {
      restrict: 'A',
      require: '^smartTable',
      template: '<a href="" title="View needs for {{dataRow[column.map]}}" ng-click="changeState()">{{dataRow[column.map]}}</a>',
      link: function postLink(scope, element, attrs, ctrl) {
        var mappedField = scope.column.map,
            pMap = paramsMap[mappedField];

        scope.changeState = function() {
          var params = {year: $stateParams.year};

          params[pMap.stateParam] = scope.dataRow[pMap.paramField];

          $state.go(pMap.stateName, params);
        };
      }
    };
  });
