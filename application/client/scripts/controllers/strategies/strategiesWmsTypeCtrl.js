'use strict';

angular.module('iswpApp').controller('StrategiesWmsTypeCtrl',
  function ($scope, $rootScope, strategiesData, HeadingService, COUNTY_TABLE_COLS, API_PATH, ISWP_VARS) {

    var wmsType = $scope.$stateParams.wmsType;

    if (_.indexOf(ISWP_VARS.wmsTypes, wmsType.toUpperCase()) === -1) {
      $scope.$state.go('^.summary', {year: '2010'});
      return;
    }

    HeadingService.current =  wmsType;
    $scope.mapDescription = 'Map shows geographic center of entities using recommended <strong>' + wmsType + '</strong> strategies and associated sources of water (water system service area boundaries may extend outside of county).';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists the share of entities\' recommended supply from <strong>' + wmsType + '</strong> strategies in {year}';

    $scope.downloadPath = API_PATH + 'strategies/wmstype/' + wmsType + '?format=csv';

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
      {map: 'StrategyName', label: 'Strategy Name'},
      {map: 'SourceName', label: 'Source', headerClass: 'text-center', cellTemplateUrl: 'templates/linkcell.html'},
      {map: 'EntityName', label: 'Name', cellTemplateUrl: 'templates/linkcell.html'},
      strategiesCol
    ];

    $scope.tableRows = strategiesData;

    //TODO: Remember the sort order when changing Year
    $scope.$on('$stateChangeSuccess', function() {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      strategiesCol.map = 'SS' + $scope.currentYear;
    });
  }
);
