var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define([], function() {
  var RegionNamesCollection, _ref;
  return RegionNamesCollection = (function(_super) {
    __extends(RegionNamesCollection, _super);

    function RegionNamesCollection() {
      _ref = RegionNamesCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    RegionNamesCollection.prototype.url = "" + BASE_PATH + "api/boundary/regions/names";

    RegionNamesCollection.prototype.model = Backbone.Model.extend({
      idAttribute: 'letter'
    });

    return RegionNamesCollection;

  })(Backbone.Collection);
});
