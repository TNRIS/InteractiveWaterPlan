var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define([], function() {
  var SenateNamesCollection, _ref;
  return SenateNamesCollection = (function(_super) {
    __extends(SenateNamesCollection, _super);

    function SenateNamesCollection() {
      _ref = SenateNamesCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SenateNamesCollection.prototype.url = "" + BASE_PATH + "api/boundary/districts/senate/names";

    return SenateNamesCollection;

  })(Backbone.Collection);
});
