// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['views/BaseTableCollectionView', 'views/StrategyView', 'scripts/text!templates/strategyTable.html'], function(BaseTableCollectionView, StrategyView, tpl) {
  var RegionStrategyCollectionView;
  return RegionStrategyCollectionView = (function(_super) {

    __extends(RegionStrategyCollectionView, _super);

    function RegionStrategyCollectionView() {
      return RegionStrategyCollectionView.__super__.constructor.apply(this, arguments);
    }

    RegionStrategyCollectionView.prototype.initialize = function(options) {
      var StrategyCollection, fetchParams;
      _.bindAll(this, 'selectType');
      this.regionLetter = options.id;
      this.viewName = ko.observable("Region " + this.regionLetter);
      fetchParams = {
        regionLetter: this.regionLetter
      };
      StrategyCollection = Backbone.Collection.extend({
        url: "" + BASE_API_PATH + "api/strategies/region"
      });
      RegionStrategyCollectionView.__super__.initialize.call(this, options.currYear, StrategyView, StrategyCollection, tpl, {
        fetchParams: fetchParams
      });
      this.selectedType = ko.observable();
      return null;
    };

    RegionStrategyCollectionView.prototype.render = function() {
      RegionStrategyCollectionView.__super__.render.apply(this, arguments);
      this.$('#strategyPlaceName').html(this.viewName());
      return this;
    };

    RegionStrategyCollectionView.prototype.selectType = function(data, event) {
      var $target, typeId, typeName;
      $target = $(event.target);
      typeId = $target.data('value');
      typeName = $target.data('name');
      this.selectedType({
        id: typeId,
        name: typeName
      });
    };

    return RegionStrategyCollectionView;

  })(BaseTableCollectionView);
});
