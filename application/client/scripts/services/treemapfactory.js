'use strict';

angular.module('iswpApp').factory('TreeMapFactory', function (SUMMARY_TABLE_COLS, ISWP_VARS) {

  var service = {};
  service.categorySummaryTreeMap = function categorySummaryTreeMap(dataForYear) {
    var treeMapData = [],
      parentName = 'All Water Use Categories';

    treeMapData.push(['Category', 'Parent', 'Amount (acre-feet/year)']);
    treeMapData.push([parentName, null, null]);

    //For each water use category, calculate the total across regions
    _.each(SUMMARY_TABLE_COLS, function(tc) {
      if (tc.map === 'WugRegion' || tc.map === 'TOTAL') {
        return;
      }

      var category = tc.map,
          categorySum = _.reduce(dataForYear, function (sum, data) {
            return sum + data[category];
          }, 0);

      treeMapData.push([
        category,
        parentName,
        categorySum
      ]);

      _.each(ISWP_VARS.regions, function (region) {
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

  service.regionSummaryTreeMap = function regionSummaryTreeMap(dataForYear) {
    var treeMapData = [],
      parentName = 'All Regions';

    treeMapData.push(['Region', 'Parent', 'Amount (acre-feet/year)']);
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

      _.each(SUMMARY_TABLE_COLS, function(tc) {
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

  //valueKey should be something like N2010 or SS2030 (value prefix + current year)
  service.entityTypeTreeMap = function entityTypeTreeMap(entityType, data, valueKey) {
    var treeMapData = [];
    var parentName = 'All Regions';

    treeMapData.push(['Region', 'Parent', 'Amount (acre-feet/year)']);
    treeMapData.push([parentName, null, null]);

    //For each region,
    _.each(ISWP_VARS.regions, function (region) {

      var regionData = _.where(data, {'WugRegion': region});
      var regionTotal = _.reduce(regionData, function (sum, curr) {
        return sum + curr[valueKey];
      }, 0);

      treeMapData.push([
        region + ' - ' + entityType.toUpperCase(),
        parentName,
        regionTotal
      ]);
    });

    var createTooltip = function (rowIndex, value) {
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

  return service;
});
