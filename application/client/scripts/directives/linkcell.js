'use strict';

angular.module('iswpApp')
  .directive('linkCell', function ($state, $stateParams) {
    var paramsMap = {
      'EntityName': {
        paramField: 'EntityId',
        stateParam: 'entityId',
        stateSuffix: '.entity'
      },
      'WugRegion': {
        paramField: 'WugRegion',
        stateParam: 'region',
        stateSuffix: '.region'
      },
      'WugCounty': {
        paramField: 'WugCounty',
        stateParam: 'county',
        stateSuffix: '.county'
      },
      'WugType': {
        paramField: 'WugType',
        stateParam: 'entityType',
        stateSuffix: '.type'
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
        var statePrefix = _.first($state.current.name.split('.'));
        var stateName = statePrefix + pMap.stateSuffix;
        scope.stateRef = $state.href(stateName, params);
      }
    };
  });
