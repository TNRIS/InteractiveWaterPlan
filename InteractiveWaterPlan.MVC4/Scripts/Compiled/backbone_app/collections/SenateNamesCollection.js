// Generated by CoffeeScript 1.4.0
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define([], function() {
  var SenateNamesCollection;
  return SenateNamesCollection = (function(_super) {

    __extends(SenateNamesCollection, _super);

    function SenateNamesCollection() {
      return SenateNamesCollection.__super__.constructor.apply(this, arguments);
    }

    SenateNamesCollection.prototype.url = "" + BASE_PATH + "api/boundary/districts/senate/names";

    return SenateNamesCollection;

  })(Backbone.Collection);
});
