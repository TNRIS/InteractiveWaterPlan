// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['views/BaseTableCollectionView', 'views/StrategyView', 'scripts/text!templates/strategyTable.html'], function(BaseTableCollectionView, StrategyView, tpl) {
  var CountyStrategyCollectionView;
  return CountyStrategyCollectionView = (function(_super) {

    __extends(CountyStrategyCollectionView, _super);

    function CountyStrategyCollectionView() {
      return CountyStrategyCollectionView.__super__.constructor.apply(this, arguments);
    }

    CountyStrategyCollectionView.prototype.initialize = function(options) {
      var StrategyCollection, fetchParams;
      this.countyId = options.countyId;
      this.countyName = options.countyName;
      this.viewName = "" + this.countyName + " County";
      fetchParams = {
        countyId: this.countyId
      };
      StrategyCollection = Backbone.Collection.extend({
        url: "" + BASE_API_PATH + "api/strategy"
      });
      CountyStrategyCollectionView.__super__.initialize.call(this, options.currYear, StrategyView, StrategyCollection, tpl, {
        fetchParams: fetchParams
      });
      return null;
    };

    CountyStrategyCollectionView.prototype.render = function() {
      CountyStrategyCollectionView.__super__.render.apply(this, arguments);
      this.$('#strategyPlaceName').html(this.viewName);
      return this;
    };

    CountyStrategyCollectionView.prototype.selectType = function(data, target) {
      var $target, typeId, typeName;
      $target = $(event.target);
      console.log("TODO: Select Strategy Type");
      typeId = $target.attr('data-value');
      typeName = $target.attr('data-name');
    };

    return CountyStrategyCollectionView;

  })(BaseTableCollectionView);
});