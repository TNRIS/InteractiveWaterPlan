// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define([], function() {
  var StrategyTypeCollection;
  return StrategyTypeCollection = (function(_super) {

    __extends(StrategyTypeCollection, _super);

    function StrategyTypeCollection() {
      return StrategyTypeCollection.__super__.constructor.apply(this, arguments);
    }

    StrategyTypeCollection.prototype.url = "" + BASE_API_PATH + "api/strategy/types";

    return StrategyTypeCollection;

  })(Backbone.Collection);
});