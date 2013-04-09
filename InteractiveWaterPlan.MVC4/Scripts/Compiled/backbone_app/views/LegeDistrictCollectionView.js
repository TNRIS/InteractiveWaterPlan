// Generated by CoffeeScript 1.4.0
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyCollectionView', 'views/StrategyView', 'scripts/text!templates/districtStrategyTable.html'], function(namespace, BaseStrategyCollectionView, StrategyView, tpl) {
  var LegeDistrictCollectionView;
  return LegeDistrictCollectionView = (function(_super) {

    __extends(LegeDistrictCollectionView, _super);

    function LegeDistrictCollectionView() {
      return LegeDistrictCollectionView.__super__.constructor.apply(this, arguments);
    }

    LegeDistrictCollectionView.prototype.initialize = function(options) {
      var StrategyCollection, fetchParams;
      if (!(options.type != null) || !options.type === "house" || !options.type === "senate") {
        throw "Options.type myst be 'house' or 'senate'.";
      }
      this.districtType = options.type;
      this.districtId = options.id;
      this.districtName = options.name;
      this.viewName = ko.observable("" + this.districtName);
      fetchParams = {
        districtId: this.districtId
      };
      StrategyCollection = Backbone.Collection.extend({
        url: "" + BASE_PATH + "api/strategies/district/" + this.districtType
      });
      LegeDistrictCollectionView.__super__.initialize.call(this, StrategyView, StrategyCollection, tpl, {
        fetchParams: fetchParams
      });
      return null;
    };

    return LegeDistrictCollectionView;

  })(BaseStrategyCollectionView);
});
