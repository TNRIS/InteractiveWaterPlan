'use strict';

angular.module('iswpApp')
  .controller('NeedsEntityTypeTableCtrl', function ($scope, $rootScope, needsData, ISWP_VARS, API_PATH) {

    var entityType = $scope.$stateParams.entityType.titleize();
    $scope.entityType = entityType;

    $scope.heading = '' + entityType;
    $scope.mapDescription = 'Map displays <strong>' + entityType + '</strong> entities and their identified water needs.';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists <strong>' + entityType + '</strong> entities and identified water needs in {year}';

    $scope.downloadPath = API_PATH + 'needs/type/' + entityType + '?format=csv';

    var needsCol = {
      map: 'N2010',
      label: 'Need (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0
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
      {map: 'WugType', label: 'Water User Type'},
      {map: 'EntityName', label: 'Name', cellTemplateUrl: cellTemplateUrl},
      {map: 'WugCounty', label: 'County', cellTemplateUrl: cellTemplateUrl},
      needsCol,
      percentCol
    ];

    $scope.tableRows = needsData;

    var createTreeMap = function(currentYear) {
      var treeMapData = [],
        parentName = 'All Regions';

      treeMapData.push(['Region', 'Parent', 'Need (acre-feet/year)']);
      treeMapData.push([parentName, null, null]);

      _.each(ISWP_VARS.regions, function(region) {

        var regionData = _.where(needsData, {'WugRegion': region});
        var regionTotal = _.reduce(regionData, function(sum, curr) {
          return sum + curr['N'+currentYear];
        }, 0);

        treeMapData.push([
          region + ' - ' + entityType.toUpperCase(),
          parentName,
          regionTotal
        ]);
      });

      var createTooltip = function(rowIndex, needValue) {
        return '<div class="tree-map-tooltip">' +
          treeMapData[rowIndex+1][0] + '<br>' +
          needValue.format() + ' acre-feet/year' +
          '</div>';
      };

      return {
        options: {
          maxColor: '#3182bd',
          midColor: '#9ecae1',
          minColor: '#deebf7',
          headerHeight: 0,
          useWeightedAverageForAggregation: true,
          fontSize: 14,
          fontFamily: "'Open Sans', Arial, 'sans serif'",
          generateTooltip: createTooltip
        },
        data: treeMapData
      };
    };

    //TODO: Remember the sort order when changing Year
    $scope.$on('$stateChangeSuccess', function() {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      needsCol.map = 'N' + $scope.currentYear;
      percentCol.map = 'NPD' + $scope.currentYear;

      $scope.treeMapConfig = createTreeMap($scope.currentYear);
    });
  });
