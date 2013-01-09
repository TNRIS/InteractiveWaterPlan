// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseTableCollectionView', 'views/StrategyTypeView', 'scripts/text!templates/strategyTypeTable.html'], function(namespace, BaseTableCollectionView, StrategyTypeView, tpl) {
  var StrategyTypeCollectionView;
  return StrategyTypeCollectionView = (function(_super) {

    __extends(StrategyTypeCollectionView, _super);

    function StrategyTypeCollectionView() {
      return StrategyTypeCollectionView.__super__.constructor.apply(this, arguments);
    }

    StrategyTypeCollectionView.prototype.initialize = function(options) {
      var StrategyCollection, fetchParams;
      _.bindAll(this, 'fetchCallback');
      this.typeId = options.id;
      this.typeName = options.name;
      this.viewName = "" + this.typeName + " Strategies";
      fetchParams = {
        typeId: this.typeId
      };
      StrategyCollection = Backbone.Collection.extend({
        url: "" + BASE_API_PATH + "api/strategies/type"
      });
      StrategyTypeCollectionView.__super__.initialize.call(this, StrategyTypeView, StrategyCollection, tpl, {
        fetchParams: fetchParams
      });
      return null;
    };

    StrategyTypeCollectionView.prototype.fetchCallback = function(strategyModels) {
      var newWugList;
      newWugList = _.map(strategyModels, function(m) {
        return {
          id: m.get("recipientEntityId"),
          name: m.get("recipientEntityName"),
          wktGeog: m.get("recipientEntityWktGeog")
        };
      });
      return namespace.wugFeatureCollection.reset(newWugList);
    };

    StrategyTypeCollectionView.prototype.render = function() {
      StrategyTypeCollectionView.__super__.render.apply(this, arguments);
      this.$('#strategyTypeName').html(this.viewName);
      return this;
    };

    return StrategyTypeCollectionView;

  })(BaseTableCollectionView);
});
