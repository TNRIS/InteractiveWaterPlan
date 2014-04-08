'use strict';

angular.module('iswpApp')
  .controller('DemandsSummaryCtrl', function ($scope, demandsData, ISWP_VARS, API_PATH) {

    $scope.heading = 'Regional Water Demand Summary';
    $scope.mapDescription = 'Map shows Regional Water Planning Areas that may be selected using cursor.';
    $scope.tableDescription = 'Table summarizes projected water demands by region and water use category in acre-feet/year (click on region for summary).';

    $scope.downloadPath = API_PATH + 'demands/summary?format=csv';

    var cellTemplateUrl = 'templates/linkcell.html';

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

    var createCategoryTreeMap = function(dataForYear) {

      var treeMapData = [],
        parentName = 'All Water Use Categories';

      treeMapData.push(['Category', 'Parent', 'Demand (acre-feet/year)']);
      treeMapData.push([parentName, null, null]);

      //For each water use category, calculate the total across regions
      _.each($scope.tableColumns, function(tc) {
        if (tc.map === 'WugRegion' || tc.map === 'TOTAL') {
          return;
        }

        var category = tc.map,
            categorySum = _.reduce(dataForYear, function(sum, data) {
              return sum + data[category];
            }, 0);

        treeMapData.push([
          category,
          parentName,
          categorySum
        ]);

        _.each(ISWP_VARS.regions, function(region) {
          var regionData = _.find(dataForYear, {'WugRegion': region});
          treeMapData.push([
            region + ' - ' + category,
            category,
            regionData[category]
          ]);
        });
      });

      var createTooltip = function(rowIndex, value) {
        return '<div class="tree-map-tooltip">' +
          treeMapData[rowIndex+1][0] + '<br>' +
          value.format() + ' acre-feet/year' +
          '</div>';
      };

      return {
        options: {
          maxColor: '#3182bd',
          midColor: '#9ecae1',
          minColor: '#deebf7',
          useWeightedAverageForAggregation: true,
          fontSize: 14,
          fontFamily: "'Open Sans', Arial, 'sans serif'",
          generateTooltip: createTooltip
        },
        data: treeMapData
      };
    };

    var createRegionTreeMap = function(dataForYear) {
      var treeMapData = [],
        parentName = 'All Regions';

      treeMapData.push(['Region', 'Parent', 'Demand (acre-feet/year)']);
      treeMapData.push([parentName, null, null]);

      //For each region, generate row for region total
      // and for each category, generate row for amount in region
      _.each(ISWP_VARS.regions, function(region) {
        var regionData = _.find(dataForYear, {'WugRegion': region});
        treeMapData.push([
          region,
          parentName,
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

      var createTooltip = function(rowIndex, value) {
        return '<div class="tree-map-tooltip">' +
          treeMapData[rowIndex+1][0] + '<br>' +
          value.format() + ' acre-feet/year' +
          '</div>';
      };

      return {
        options: {
          maxColor: '#3182bd',
          midColor: '#9ecae1',
          minColor: '#deebf7',
          useWeightedAverageForAggregation: true,
          fontSize: 14,
          fontFamily: "'Open Sans', Arial, 'sans serif'",
          generateTooltip: createTooltip
        },
        data: treeMapData
      };
    };


    //TODO: Remember the sort order when changing Year
    //Refresh stuff when the year changes
    $scope.$on('$stateChangeSuccess', function() {
      $scope.currentYear = $scope.$stateParams.year;

      //Get only the demandsData for the currentYear
      var dataForYear = _.where(demandsData, {DECADE:
        $scope.currentYear});

      $scope.tableRows = dataForYear;
      $scope.treeMapConfig = createRegionTreeMap(dataForYear);
      $scope.categoryTreeMapConfig = createCategoryTreeMap(dataForYear);
    });

    return;
  });
