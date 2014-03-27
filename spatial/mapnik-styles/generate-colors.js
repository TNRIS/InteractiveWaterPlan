"use strict";
var _ = require('lodash');
var chroma = require('chroma-js');
var fs = require('fs');
var Handlebars = require('handlebars');
var shapefile = require('shapefile');
var turf = require('turf');

var template_path = './generate-colors.hbs';

var shp_path;

var legislativeBody = _.last(process.argv);
if (legislativeBody === 'house') {
  shp_path = '../TexasHouseDistricts/TX_HOUSE_PLANH358_with_detailed_coast.shp';
} 
else if (legislativeBody === 'senate') {
  shp_path = '../TexasSenateDistricts/TX_SENATE_PLANS172_with_detailed_coast.shp';
} 
else {
  console.log('you must provide the legislative body (either house or senate) as the last command line argument.');
  process.exit();
}

var possibleColors = _.map([
  '#8ec3ab',
  '#b3e2cd',
  '#c5d7e8',
  '#decbe4',
  '#e5d8bd',
  '#e6f5c9',
  '#fbb4ae',
  '#fddaec',
  '#fed9a6',
  '#ffffcc'
], chroma.hex);


var calculateBBOXProperties = function (bbox) {
  return {
    x: (bbox[0] + bbox[2]) / 2,
    y: (bbox[1] + bbox[3]) / 2,
    width: (bbox[2] - bbox[0]),
    height: (bbox[3] - bbox[1])
  };
};

var bboxOverlaps = function (first, second) {
  var a = calculateBBOXProperties(first),
      b = calculateBBOXProperties(second);

  return (Math.abs(a.x - b.x) * 2 < (a.width + b.width)) &&
         (Math.abs(a.y - b.y) * 2 < (a.height + b.height));
};

var calculateBBOX = function (feature) {
  var bbox = [];
  turf.envelope(feature, function (err, envelope) {
    if (err) {
      throw err;
    }
    var coords = envelope.geometry.coordinates[0];
    bbox = [
      coords[0][0],
      coords[0][1],
      coords[2][0],
      coords[2][1]
    ];
  });
  return bbox;
};

var findNeighbors = function (polygon, possibleNeighbors) {
  return _.filter(possibleNeighbors, function (possibleNeighbor) {
    return bboxOverlaps(polygon.bbox, possibleNeighbor.bbox);
  });
};

shapefile.read(shp_path, function (err, data) {
  var uncolored = data.features;
  var colored = [];

  while (uncolored.length > 0) {
    var polygon = uncolored.pop();
    polygon.bbox = calculateBBOX(polygon);
    var neighbors = findNeighbors(polygon, colored);
    var bannedColors = _.map(neighbors, function (neighbor) { 
      return neighbor.properties.color;
    });

    polygon.properties.color = _.sample(_.difference(possibleColors, bannedColors));
    if(polygon.properties.color === undefined) {
      _.each(neighbors, function (neighbor) {
        neighbor.properties.color = undefined;
        uncolored.push(neighbor);
        _.remove(colored, function(c) {
          return c.properties.District === neighbor.properties.District
        });
      });
      uncolored.push(polygon);
    } else {
      colored.push(polygon);
    }
  }
  colored = _.sortBy(colored, function (c) { return c.properties.District; });

  var colors = _.map(colored, function(coloredPolygon, idx) {
    var color = coloredPolygon.properties.color;
    return {
      'district': coloredPolygon.properties.District,
      'outline': color.darken(20).hex(),
      'poly': color.hex(),
      'text': color.darken(40).hex()
    }
  });

  fs.readFile(template_path, function (err, data) {
    var template = Handlebars.compile(String(data));
    console.log(template({
      legislativeBody: legislativeBody,
      colors: colors
    }));
  });
});
