'use strict';

angular.module('iswpApp')
  .controller('DemandsEntityTypeCtrl', function ($scope, $rootScope, demandsData, localStorageService, ISWP_VARS, API_PATH) {

    var entityType = $scope.$stateParams.entityType.titleize();
    $scope.entityType = entityType;

    $scope.heading = '' + entityType;
    $scope.mapDescription = 'Map displays <strong>' + entityType + '</strong> entities and their projected water demands.';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists <strong>' + entityType + '</strong> entities and projected water demands in {year}';

    $scope.downloadPath = API_PATH + 'demands/type/' + entityType + '?format=csv';

    var demandsCol = {
      map: 'D2010',
      label: 'Demand (acre-feet/year)',
      cellClass: 'number',
      formatFunction: 'number'
    };

    var cellTemplateUrl = 'templates/linkcell.html';

    $scope.tableColumns = [
      {map: 'WugType', label: 'Entity Type'},
      {map: 'EntityName', label: 'Name', cellTemplateUrl: cellTemplateUrl},
      {map: 'WugCounty', label: 'County', cellTemplateUrl: cellTemplateUrl},
      demandsCol
    ];

    var storedItemsPerPage = localStorageService.get('tableItemsPerPage');
    $scope.itemsPerPage = storedItemsPerPage || 20;

    $scope.tableConfig = {
      selectionMode: 'single',
      isGlobalSearchActivated: true,
      isPaginationEnabled: true,
      itemsByPage: $scope.itemsPerPage
    };

    $scope.tableRows = demandsData;

    var createTreeMap = function(currentYear) {
      var treeMapData = [],
        parentName = 'All Regions';

      treeMapData.push(['Region', 'Parent', 'Demand (acre-feet/year)']);
      treeMapData.push([parentName, null, null]);

      //For each region,
      _.each(ISWP_VARS.regions, function(region) {

        var regionData = _.where(demandsData, {'WugRegion': region});
        var regionTotal = _.reduce(regionData, function(sum, curr) {
          return sum + curr['D'+currentYear];
        }, 0);

        treeMapData.push([
          region + ' - ' + entityType.toUpperCase(),
          parentName,
          regionTotal
        ]);
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
      $scope.currentYear = $scope.$stateParams.year;
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      demandsCol.map = 'D' + $scope.currentYear;

      $scope.treeMapConfig = createTreeMap($scope.currentYear);
    });

    $scope.$watch('itemsPerPage', function() {
      if (!$scope.itemsPerPage) {
        return;
      }

      $scope.tableConfig.itemsByPage = $scope.itemsPerPage;
      localStorageService.set('tableItemsPerPage', $scope.itemsPerPage);
    });

    //Watch for selectionChange events from the Smart-Table
    // and emit a rootScope event to toggle the feature
    // highlight
    $scope.$on('selectionChange', function(event, args) {
      $rootScope.$emit('map:togglehighlight', args.item);
      return;
    });

    return;
  });
