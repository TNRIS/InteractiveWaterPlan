// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['views/BaseTableCollectionView', 'views/StrategyTypeView', 'scripts/text!templates/strategyTypeTable.html'], function(BaseTableCollectionView, StrategyTypeView, tpl) {
  var TypeStrategyCollectionView;
  return TypeStrategyCollectionView = (function(_super) {

    __extends(TypeStrategyCollectionView, _super);

    function TypeStrategyCollectionView() {
      return TypeStrategyCollectionView.__super__.constructor.apply(this, arguments);
    }

    TypeStrategyCollectionView.prototype.initialize = function(options) {
      var StrategyCollection, fetchParams;
      this.typeId = options.id;
      this.typeName = options.name;
      this.viewName = "" + this.typeName + " Strategies";
      fetchParams = {
        typeId: this.typeId
      };
      StrategyCollection = Backbone.Collection.extend({
        url: "" + BASE_API_PATH + "api/strategies/type"
      });
      TypeStrategyCollectionView.__super__.initialize.call(this, options.currYear, StrategyTypeView, StrategyCollection, tpl, {
        fetchParams: fetchParams
      });
      return null;
    };

    TypeStrategyCollectionView.prototype.render = function() {
      TypeStrategyCollectionView.__super__.render.apply(this, arguments);
      this.$('#strategyTypeName').html(this.viewName);
      return this;
    };

    return TypeStrategyCollectionView;

  })(BaseTableCollectionView);
});
