var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define([], function() {
  var HouseNamesCollection, _ref;
  return HouseNamesCollection = (function(_super) {
    __extends(HouseNamesCollection, _super);

    function HouseNamesCollection() {
      _ref = HouseNamesCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HouseNamesCollection.prototype.url = "" + BASE_PATH + "api/boundary/districts/house/names";

    return HouseNamesCollection;

  })(Backbone.Collection);
});
