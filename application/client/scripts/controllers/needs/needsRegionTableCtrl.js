'use strict';

angular.module('iswpApp').controller('NeedsRegionTableCtrl',
  function ($scope, $rootScope, needsData, REGION_TABLE_COLS, API_PATH) {

    var region = $scope.$stateParams.region.toUpperCase();

    $scope.heading = 'Region ' + region;
    $scope.mapDescription = 'Map displays entities and their identified water needs in <strong>Region '+region+'</strong> (water system service area boundaries may extend outside of region).';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists the share of entities\' identified water needs within <strong>Region '+region+'</strong> in {year}';

    $scope.downloadPath = API_PATH + 'needs/region/' + region + '?format=csv';

    var needsCol = {
      map: 'N2010',
      label: 'Need (acre-feet/year) in Region',
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

    $scope.tableColumns = REGION_TABLE_COLS.concat([needsCol, percentCol]);

    $scope.tableRows = needsData;

    //TODO: Remember the sort order when changing Year

    $scope.$on('$stateChangeSuccess', function() {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      needsCol.map = 'N' + $scope.currentYear;
      percentCol.map = 'NPD' + $scope.currentYear;
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
