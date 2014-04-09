'use strict';

angular.module('iswpApp')
  .controller('NeedsEntityTableCtrl',
    function ($scope, needsData, entitySummary, ChartService, EntityService, API_PATH) {

      //if entitySummary is null then this was called for an invalid entityId
      // so return to home view
      if (!entitySummary) {
        $scope.$state.go('needs.summary', {year: '2010'});
        return;
      }

      var entityId = $scope.$stateParams.entityId,
        entity = EntityService.getEntity(entityId),
        entityName = entity.EntityName;

      $scope.heading = '' + entityName;
      $scope.mapDescription = 'Map displays <strong>' + entityName + '</strong>.';
      //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
      var tableDescTpl = 'Table lists identified water needs of <strong>'+ entityName + '</strong> in {year}.';
      var chartDescTpl = 'Graph displays a summary of: Projected Water Demands, Existing Water Supplies, Identified Water Need, and Recommended Strategy Supply of <strong>'+ entityName + '</strong> in {year}.';

      $scope.downloadPath = API_PATH + 'needs/entity/' + entityId + '?format=csv';

      var needsCol = {
        map: 'N2010',
        label: 'Need (acre-feet/year)',
        cellClass: 'number',
        formatFunction: 'number'
      };

      var percentCol = {
        map: 'NPD2010',
        label: 'Overall Entity Need as % of Demand*',
        cellClass: 'percent',
        headerClass: 'text-center',
        formatFunction: function(val) { return '' + val + '%'; }
      };

      var cellTemplateUrl = 'templates/linkcell.html';

      $scope.tableColumns = [
        {map: 'EntityName', label: 'Name'},
        {map: 'WugRegion', label: 'Region', cellClass: 'text-center', cellTemplateUrl: cellTemplateUrl},
        {map: 'WugCounty', label: 'County', cellTemplateUrl: cellTemplateUrl},
        {map: 'WugType', label: 'Entity Type', cellTemplateUrl: cellTemplateUrl},
        needsCol,
        percentCol
      ];

      $scope.tableConfig = {
        isPaginationEnabled: false
      };

      $scope.tableRows = needsData;

      //TODO: Remember the sort order when changing Year

      $scope.$on('$stateChangeSuccess', function() {
        var year = $scope.currentYear = $scope.$stateParams.year;
        $scope.tableDescription = tableDescTpl.assign({year: year});
        $scope.chartDescription = chartDescTpl.assign({year: year});

        $scope.chartConfig = ChartService.buildEntityChartConfig(entitySummary, year);

        needsCol.map = 'N' + year;
        percentCol.map = 'NPD' + year;
      });

      $scope.chartSelect = function(selectedItem) {
        var rowId = $scope.chartConfig.data[selectedItem.row+1][4];

        switch (rowId) {
          case 'needs':
            $scope.$state.go('needs.entity', $scope.$stateParams);
            break;
          case 'demands':
            $scope.$state.go('demands.entity', $scope.$stateParams);
            break;
          //TODO: existing and supply
          default:
            break;
        }
      };

      return;
    }
  );
