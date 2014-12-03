'use strict';

angular.module('iswpApp')
  .controller('DemandsCountyCtrl', function ($scope, $rootScope, demandsData, API_PATH) {

    var county = $scope.$stateParams.county.titleize();

    $scope.heading = '' + county + ' County';
    $scope.mapDescription = 'Map displays entities and their projected water demands within <strong>'+county+' County</strong> (water system service area boundaries may extend outside of county).';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists the share of entities\' projected water demands within <strong>'+county+' County</strong> in {year}';

    $scope.downloadPath = API_PATH + 'demands/county/' + county + '?format=csv';

    var demandsCol = {
      map: 'D2010',
      label: 'Demand (acre-feet/year) in County',
      cellClass: 'number',
      formatFunction: 'number',
      formatParameter: 0,
      headerClass: 'text-center'
    };

    var cellTemplateUrl = 'templates/linkcell.html';

    $scope.tableColumns = [
      {map: 'WugCounty', label: 'County'},
      {map: 'EntityName', label: 'Name', cellTemplateUrl: cellTemplateUrl},
      {map: 'WugType', label: 'Water User Type', cellTemplateUrl: cellTemplateUrl},
      demandsCol
    ];

    $scope.tableRows = demandsData;

    //TODO: Remember the sort order when changing Year

    $scope.$on('$stateChangeSuccess', function() {
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      demandsCol.map = 'D' + $scope.currentYear;
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
