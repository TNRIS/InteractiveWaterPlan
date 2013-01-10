// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseTableCollectionView', 'views/StrategyView', 'scripts/text!templates/strategyTable.html'], function(namespace, BaseTableCollectionView, StrategyView, tpl) {
  var CountyStrategyCollectionView;
  return CountyStrategyCollectionView = (function(_super) {

    __extends(CountyStrategyCollectionView, _super);

    function CountyStrategyCollectionView() {
      return CountyStrategyCollectionView.__super__.constructor.apply(this, arguments);
    }

    CountyStrategyCollectionView.prototype.initialize = function(options) {
      var StrategyCollection, fetchParams;
      _.bindAll(this, 'fetchCallback');
      this.countyId = options.id;
      this.countyName = options.name;
      this.viewName = ko.observable("" + this.countyName + " County");
      fetchParams = {
        countyId: this.countyId
      };
      StrategyCollection = Backbone.Collection.extend({
        url: "" + BASE_API_PATH + "api/strategies/county"
      });
      CountyStrategyCollectionView.__super__.initialize.call(this, StrategyView, StrategyCollection, tpl, {
        fetchParams: fetchParams
      });
      return null;
    };

    CountyStrategyCollectionView.prototype.fetchCallback = function(strategyModels) {
      var newWugList;
      newWugList = _.map(strategyModels, function(m) {
        return {
          id: m.get("recipientEntityId"),
          name: m.get("recipientEntityName"),
          wktGeog: m.get("recipientEntityWktGeog"),
          sourceSupply: m.get("supply" + namespace.currYear)
        };
      });
      namespace.wugFeatureCollection.reset(newWugList);
    };

    CountyStrategyCollectionView.prototype.render = function() {
      CountyStrategyCollectionView.__super__.render.apply(this, arguments);
      return this;
    };

    return CountyStrategyCollectionView;

  })(BaseTableCollectionView);
});
