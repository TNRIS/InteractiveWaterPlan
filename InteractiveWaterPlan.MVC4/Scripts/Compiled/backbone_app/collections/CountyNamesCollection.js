var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define([], function() {
  var CountyNamesCollection, _ref;
  return CountyNamesCollection = (function(_super) {
    __extends(CountyNamesCollection, _super);

    function CountyNamesCollection() {
      _ref = CountyNamesCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    CountyNamesCollection.prototype.url = "" + BASE_PATH + "api/boundary/counties/names";

    return CountyNamesCollection;

  })(Backbone.Collection);
});
