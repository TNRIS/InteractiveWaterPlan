'use strict';

angular.module('iswpApp')
  .controller('NeedsEntityTableCtrl', function ($scope, needsData, EntityService) {

    var entityId = $scope.$stateParams.entityId,
      entity = EntityService.getEntity(entityId),
      entityName = entity.EntityName.titleize();

    $scope.heading = '' + entityName;
    $scope.mapDescription = 'Map shows geographic center of <strong>' + entityName + '</strong>.';
    //$scope.tableDescription has variable year, filled in during $stateChangeSuccess event handler
    var tableDescTpl = 'Table lists identified water needs<span class="note-marker">*</span> of <strong>'+ entityName + '</strong> in {year}.';

    var needsCol = {
      map: 'N2010',
      label: 'Need (acre-feet/yr)',
      formatFunction: 'number'
    };

    var percentCol = {
      map: 'NPD2010',
      label: 'Entity Need as % of Demand**'
    };

    $scope.tableColumns = [
      {map: 'EntityName', label: 'Name'},
      {map: 'WugRegion', label: 'Region'}, //TODO: link
      {map: 'WugCounty', label: 'County'}, //TODO: link
      {map: 'WugType', label: 'Entity Type'}, //TODO: link
      needsCol,
      percentCol
    ];

    $scope.tableConfig = {
      isPaginationEnabled: true,
      itemsByPage: 20 //TODO: Make user-changeable
    };

    $scope.tableRows = needsData;

    //TODO: Remember the sort order when changing Year

    $scope.$on('$stateChangeSuccess', function() {
      $scope.currentYear = $scope.$stateParams.year;
      $scope.tableDescription = tableDescTpl.assign({year: $scope.currentYear});

      needsCol.map = 'N' + $scope.currentYear;
      percentCol.map = 'NPD' + $scope.currentYear;
    });
    return;
  });
