var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyCollectionView', 'views/CountyStrategyView', 'scripts/text!templates/countyStrategyTable.html'], function(namespace, BaseStrategyCollectionView, CountyStrategyView, tpl) {
  var CountyStrategyCollectionView, _ref;
  return CountyStrategyCollectionView = (function(_super) {
    __extends(CountyStrategyCollectionView, _super);

    function CountyStrategyCollectionView() {
      _ref = CountyStrategyCollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    CountyStrategyCollectionView.prototype.initialize = function(options) {
      var StrategyCollection, fetchParams;
      this.countyId = options.id;
      this.countyName = options.name;
      this.viewName = ko.observable("" + this.countyName + " County");
      fetchParams = {
        countyId: this.countyId
      };
      StrategyCollection = Backbone.Collection.extend({
        url: "" + BASE_PATH + "api/strategies/county"
      });
      CountyStrategyCollectionView.__super__.initialize.call(this, CountyStrategyView, StrategyCollection, tpl, {
        fetchParams: fetchParams
      });
      return null;
    };

    return CountyStrategyCollectionView;

  })(BaseStrategyCollectionView);
});
