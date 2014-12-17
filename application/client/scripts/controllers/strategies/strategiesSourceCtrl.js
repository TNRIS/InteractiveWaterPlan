'use strict';

angular.module('iswpApp').controller('StrategiesSourceCtrl',
  function ($scope, strategiesData, StrategySourceService, HeadingService, WMS_TABLE_ADDL_COLS, API_PATH) {

    var sourceId = $scope.$stateParams.sourceId;
    var source = StrategySourceService.getSource(sourceId);

    //if source is null then this was called for an invalid sourceId
    //so return to home view
    if (!source) {
      $scope.$state.go('^.summary', {year: '2010'});
      return;
    }

    var sourceName = source.SourceName;

    HeadingService.current =  sourceName;
    $scope.mapDescription = 'Map displays a schematic representation of all water user groups with recommended strategies that rely on water from this water source.';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists recommended water management strategies along with entities using water from <strong>'+ sourceName + '</strong> in {year}.';

    $scope.downloadPath = API_PATH + 'strategies/source/' + sourceId + '?format=csv';

    var strategiesCol = {
      map: 'SS2010',
      label: 'Recommended Strategy Supply (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0,
      headerClass: 'text-center'
    };

    $scope.tableColumns = [
      {map: 'WugRegion', label: 'Region', cellClass: 'text-center', cellTemplateUrl: 'templates/linkcell.html'},
      {map: 'WugCounty', label: 'County', cellTemplateUrl: 'templates/linkcell.html'},
      {map: 'EntityName', label: 'Name', cellTemplateUrl: 'templates/linkcell.html'}
    ].concat(WMS_TABLE_ADDL_COLS).concat(strategiesCol);

    $scope.tableRows = strategiesData;

    //TODO: Remember the sort order when changing Year
    $scope.$on('$stateChangeSuccess', function() {
      var year = $scope.currentYear;
      $scope.tableDescription = tableDescTpl.assign({year: year});

      strategiesCol.map = 'SS' + year;
    });

  }
);
