var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define([], function() {
  var PlaceFeature, _ref;
  return PlaceFeature = (function(_super) {
    __extends(PlaceFeature, _super);

    function PlaceFeature() {
      _ref = PlaceFeature.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PlaceFeature.prototype.url = "" + BASE_PATH + "api/place/feature/hull";

    return PlaceFeature;

  })(Backbone.Model);
});
