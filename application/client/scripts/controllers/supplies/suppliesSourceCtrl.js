'use strict';

angular.module('iswpApp').controller('SuppliesSourceCtrl',
  function ($scope, suppliesData, ExistingSourceService, HeadingService, API_PATH) {

    var sourceId = $scope.$stateParams.sourceId;
    var source = ExistingSourceService.getSource(sourceId);

    //if source is null then this was called for an invalid sourceId
    //so return to home view
    if (!source) {
      $scope.$state.go('^.summary', {year: '2010'});
      return;
    }

    var sourceName = source.SourceName;

    HeadingService.current =  sourceName;
    $scope.mapDescription = 'Map displays a schematic representation of all entities with projected existing water supply from this water source.';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists entities using water from <strong>'+ sourceName + '</strong> in {year}.';

    $scope.downloadPath = API_PATH + 'supplies/source/' + sourceId + '?format=csv';

    var suppliesCol = {
      map: 'WS2010',
      label: 'Existing Water Supply (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0,
      headerClass: 'text-center'
    };

    $scope.tableColumns = [
      {map: 'WugRegion', label: 'Region', cellClass: 'text-center', cellTemplateUrl: 'templates/linkcell.html'},
      {map: 'EntityName', label: 'Name', cellTemplateUrl: 'templates/linkcell.html'},
      suppliesCol
    ];

    $scope.tableRows = suppliesData;

    $scope.$on('$stateChangeSuccess', function() {
      var year = $scope.currentYear;
      $scope.tableDescription = tableDescTpl.assign({year: year});

      suppliesCol.map = 'WS' + year;
    });

  }
);
