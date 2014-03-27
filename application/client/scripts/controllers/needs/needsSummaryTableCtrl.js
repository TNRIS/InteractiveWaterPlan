'use strict';

angular.module('iswpApp')
  .controller('NeedsSummaryTableCtrl', function ($scope, needsData, ISWP_VARS) {

    $scope.heading = 'Regional Water Needs Summary';
    $scope.mapDescription = 'Map shows Regional Water Planning Areas that may be selected using cursor.';
    $scope.tableDescription = 'Table summarizes identified water needs by region and water use category in acre-feet/year (click on region for summary).';

    var cellTemplateUrl = 'partials/needs/needs_link_cell.html';

    $scope.tableColumns = [
      {map: 'WugRegion', label: 'Region', cellTemplateUrl: cellTemplateUrl, headerClass: 'text-center', cellClass: 'text-center'},
      {map: 'MUNICIPAL', label: 'Municipal', formatFunction: 'number', headerClass: 'text-center', cellClass: 'number'},
      {map: 'MANUFACTURING', label: 'Manufacturing', formatFunction: 'number', headerClass: 'text-center', cellClass: 'number'},
      {map: 'MINING', label: 'Mining', formatFunction: 'number', headerClass: 'text-center', cellClass: 'number'},
      {map: 'STEAMELECTRIC', label: 'Steam-Electric', formatFunction: 'number', headerClass: 'text-center', cellClass: 'number'},
      {map: 'LIVESTOCK', label: 'Livestock', formatFunction: 'number', headerClass: 'text-center', cellClass: 'number'},
      {map: 'IRRIGATION', label: 'Irrigation', formatFunction: 'number', headerClass: 'text-center', cellClass: 'number'},
      {map: 'TOTAL', label: 'Total', formatFunction: 'number', headerClass: 'text-center', cellClass: 'number'},
    ];

    $scope.tableConfig = {
      isPaginationEnabled: false
    };

    var createTreeMap = function(dataForYear) {
      var treeMapData = [];
      treeMapData.push(['Region', 'Parent', 'Need (acre-feet/year)']);
      treeMapData.push(['State of Texas', null, 100]); //TODO: Real total

      //For each region, generate total
      // and for each type, generate amount in region
      _.each(ISWP_VARS.regions, function(region) {
        var regionData = _.find(dataForYear, {'WugRegion': region});
        treeMapData.push([region,
          'State of Texas',
          regionData.TOTAL
        ]);

        _.each($scope.tableColumns, function(tc) {
          if (tc.map === 'WugRegion' || tc.map === 'TOTAL') {
            return;
          }

          treeMapData.push([
            region + ' - ' + tc.map,
            region,
            regionData[tc.map]
          ]);
        });
      });

      var showTooltip = function(rowIndex, needValue) {

        return '<div class="tree-map-tooltip">' +
          needValue.format() + ' acre-feet/year' +
          '</div>';
      };

      //TODO: Needs to be redrawn on year change
      $scope.treeMapConfig = {
        options: {
          maxDepth: 1,
          maxColor: '#3182bd',
          midColor: '#9ecae1',
          minColor: '#deebf7',
          useWeightedAverageForAggregation: true,
          fontSize: 14,
          fontFamily: "'Open Sans', Arial, 'sans serif'",
          generateTooltip: showTooltip
        },
        data: treeMapData
      };
    };

    //TODO: Remember the sort order when changing Year
    $scope.$on('$stateChangeSuccess', function() {
      $scope.currentYear = $scope.$stateParams.year;

      //Get only the needsData for the currentYear
      var dataForYear = _.where(needsData, {DECADE:
        $scope.currentYear});

      $scope.tableRows = dataForYear;
      createTreeMap(dataForYear);
    });


  });
