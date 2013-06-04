var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define([], function() {
  var RegionFeatureCollection, _ref;
  return RegionFeatureCollection = (function(_super) {
    __extends(RegionFeatureCollection, _super);

    function RegionFeatureCollection() {
      _ref = RegionFeatureCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    RegionFeatureCollection.prototype.url = "" + BASE_PATH + "api/boundary/regions/all";

    return RegionFeatureCollection;

  })(Backbone.Collection);
});
