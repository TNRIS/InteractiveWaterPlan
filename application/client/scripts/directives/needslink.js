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

    return {
      restrict: 'A',
      require: '^smartTable',
      template: '<a ng-href="{{stateRef}}" title="View needs for {{dataRow[column.map]}}">' +
        '{{dataRow[column.map]}}</a>',
      link: function postLink(scope, element, attrs, ctrl) {
        var mappedField = scope.column.map,
            pMap = paramsMap[mappedField],
            params = {year: $stateParams.year};

        params[pMap.stateParam] = scope.dataRow[pMap.paramField];

        // Build the href based on the paramsMap options
        scope.stateRef = $state.href(pMap.stateName, params);
      }
    };
  });
