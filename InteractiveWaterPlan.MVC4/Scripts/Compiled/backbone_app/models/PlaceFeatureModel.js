// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define([], function() {
  var PlaceFeature;
  return PlaceFeature = (function(_super) {

    __extends(PlaceFeature, _super);

    function PlaceFeature() {
      return PlaceFeature.__super__.constructor.apply(this, arguments);
    }

    PlaceFeature.prototype.url = "" + BASE_API_PATH + "api/place/feature";

    return PlaceFeature;

  })(Backbone.Model);
});