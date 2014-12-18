'use strict';

angular.module('iswpApp').factory('TreeMapFactory', function (TREE_MAP_COLORS, SUMMARY_TABLE_COLS, ISWP_VARS) {

  var service = {};

  var baseOptions = {
    maxColor: TREE_MAP_COLORS.MAX,
    midColor: TREE_MAP_COLORS.MID,
    minColor: TREE_MAP_COLORS.MIN,
    useWeightedAverageForAggregation: true,
    fontSize: 14,
    fontFamily: "'Open Sans', Arial, 'sans serif'"
  };

  function createTooltip(treeMapData) {
    return function(rowIndex, value) {
      return [
        '<div class="tree-map-tooltip">',
        treeMapData[rowIndex+1][0],
        '<br>',
        value.format(),
        ' acre-feet/year',
        '</div>'
      ].join('');
    };
  }

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

    return {
      options: _.extend({
        generateTooltip: createTooltip(treeMapData)
      }, baseOptions),
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

    return {
      options: _.extend({
        generateTooltip: createTooltip(treeMapData)
      }, baseOptions),
      data: treeMapData
    };
  };

  //valueKey should be something like N2010 or SS2030 (value prefix + current year)
  service.entityTypeByRegion = function entityTypeByRegion(entityType, data, valueKey) {
    var treeMapData = [];
    var parentName = 'All Regions';

    treeMapData.push(['Region', 'Parent', 'Amount (acre-feet/year)']);
    treeMapData.push([parentName, null, null]);

    _.each(ISWP_VARS.regions, function (region) {

      var regionData = _.where(data, {'WugRegion': region});
      var regionTotal = _.reduce(regionData, function (sum, curr) {
        if (angular.isNumber(curr[valueKey])) {
          return sum + curr[valueKey];
        }
        return sum;
      }, 0);

      treeMapData.push([
        region + ' - ' + entityType.toUpperCase(),
        parentName,
        regionTotal
      ]);
    });

    return {
      options: _.extend({
        generateTooltip: createTooltip(treeMapData)
      }, baseOptions),
      data: treeMapData
    };
  };

  //valueKey should be something like N2010 or SS2030 (value prefix + current year)
  service.regionByCounty = function regionByCounty(region, data, valueKey) {
    var treeMapData = [];
    var parentName = 'Counties in Region ' + region;

    treeMapData.push(['County', 'Parent', 'Amount (acre-feet/year)']);
    treeMapData.push([parentName, null, null]);

    _.each(ISWP_VARS.counties, function (county) {

      var countyData = _.where(data, {'WugCounty': county});
      var countyTotal = _.reduce(countyData, function (sum, curr) {
        if (angular.isNumber(curr[valueKey])) {
          return sum + curr[valueKey];
        }
        return sum;
      }, 0);

      treeMapData.push([
        county.toUpperCase(),
        parentName,
        countyTotal
      ]);
    });

    return {
      options: _.extend({
        generateTooltip: createTooltip(treeMapData)
      }, baseOptions),
      data: treeMapData
    };
  };

  service.regionByEntityType = function regionByEntityType(region, data, valueKey) {
    var treeMapData = [];
    var parentName = 'All Water Use Categories in Region ' + region;

    treeMapData.push(['Water Use Category', 'Parent', 'Amount (acre-feet/year)']);
    treeMapData.push([parentName, null, null]);

    _.each(ISWP_VARS.entityTypes, function (type) {

      var typeData = _.where(data, {'WugType': type});
      var typeTotal = _.reduce(typeData, function (sum, curr) {
        if (angular.isNumber(curr[valueKey])) {
          return sum + curr[valueKey];
        }
        return sum;
      }, 0);

      treeMapData.push([
        type.toUpperCase(),
        parentName,
        typeTotal
      ]);
    });


    return {
      options: _.extend({
        generateTooltip: createTooltip(treeMapData)
      }, baseOptions),
      data: treeMapData
    };
  };

  return service;
});
