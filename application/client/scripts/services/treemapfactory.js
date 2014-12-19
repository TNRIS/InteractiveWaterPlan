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

  function sum(data, valueKey) {
    return _.reduce(data, function (total, curr) {
      if (angular.isNumber(curr[valueKey])) {
        return total + curr[valueKey];
      }
      return total;
    }, 0);
  }

  function pct(num, total) {
    return Math.round(num/total * 100) + '%';
  }

  service.categorySummaryTreeMap = function categorySummaryTreeMap(dataForYear) {
    var treeMapData = [],
      parentName = 'All Water Use Categories';

    treeMapData.push(['Category', 'Parent', 'Amount (acre-feet/year)']);
    treeMapData.push([parentName, null, null]);

    var statewideTotal = sum(dataForYear, 'TOTAL');

    //For each water use category, calculate the total across regions
    _.each(SUMMARY_TABLE_COLS, function(tc) {
      if (tc.map === 'WugRegion' || tc.map === 'TOTAL') {
        return;
      }

      var category = tc.map;
      var categorySum = sum(dataForYear, category);
      var categoryLabel = category + ': ' + pct(categorySum, statewideTotal);

      treeMapData.push([
        categoryLabel,
        parentName,
        categorySum
      ]);

      _.each(ISWP_VARS.regions, function (region) {
        var regionData = _.find(dataForYear, {'WugRegion': region});
        treeMapData.push([
          region + ' - ' + category + ': ' + pct(regionData[category], categorySum),
          categoryLabel,
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

    var statewideTotal = sum(dataForYear, 'TOTAL');

    //For each region, generate row for region total
    // and for each category, generate row for amount in region
    _.each(ISWP_VARS.regions, function(region) {
      var regionData = _.find(dataForYear, {'WugRegion': region});
      var regionLabel = region + ': ' + pct(regionData.TOTAL, statewideTotal);

      treeMapData.push([
        regionLabel,
        parentName,
        regionData.TOTAL
      ]);

      _.each(SUMMARY_TABLE_COLS, function(tc) {
        if (tc.map === 'WugRegion' || tc.map === 'TOTAL') {
          return;
        }

        treeMapData.push([
          region + ' - ' + tc.map + ': ' + pct(regionData[tc.map], regionData.TOTAL),
          regionLabel,
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

    var total = sum(data, valueKey);

    _.each(ISWP_VARS.regions, function (region) {

      var regionData = _.where(data, {'WugRegion': region});
      var regionTotal = sum(regionData, valueKey);

      treeMapData.push([
        region + ': ' + pct(regionTotal, total),
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

    var total = sum(data, valueKey);

    _.each(ISWP_VARS.counties, function (county) {

      var countyData = _.where(data, {'WugCounty': county});
      var countyTotal = sum(countyData, valueKey);

      treeMapData.push([
        county.toUpperCase() + ': ' + pct(countyTotal, total),
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

    var total = sum(data, valueKey);

    _.each(ISWP_VARS.entityTypes, function (type) {

      var typeData = _.where(data, {'WugType': type});
      var typeTotal = sum(typeData, valueKey);

      treeMapData.push([
        type.toUpperCase() + ': ' + pct(typeTotal, total),
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

  service.regionByStrategyType = function regionByStrategyType(region, data, valueKey) {
    var treeMapData = [];
    var parentName = 'All Strategy Types in Region ' + region;

    treeMapData.push(['Strategy Type', 'Parent', 'Amount (acre-feet/year)']);
    treeMapData.push([parentName, null, null]);

    var total = sum(data, valueKey);

    _.each(ISWP_VARS.wmsTypes, function (type) {

      var typeData = _.where(data, {'wmsType': type});
      var typeTotal = sum(typeData, valueKey);

      treeMapData.push([
        type.toUpperCase() + ': ' + pct(typeTotal, total),
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
