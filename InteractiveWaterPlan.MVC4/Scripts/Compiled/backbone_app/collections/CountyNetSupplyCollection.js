// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define([], function() {
  var CountyNetSupplyCollection;
  return CountyNetSupplyCollection = (function(_super) {

    __extends(CountyNetSupplyCollection, _super);

    function CountyNetSupplyCollection() {
      return CountyNetSupplyCollection.__super__.constructor.apply(this, arguments);
    }

    CountyNetSupplyCollection.prototype.url = "" + BASE_PATH + "api/supply/county-net";

    return CountyNetSupplyCollection;

  })(Backbone.Collection);
});
