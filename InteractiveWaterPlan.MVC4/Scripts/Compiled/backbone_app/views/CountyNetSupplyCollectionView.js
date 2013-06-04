var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseSelectableRegionStrategyView', 'views/CountyNetSupplyView', 'collections/CountyNetSupplyCollection', 'scripts/text!templates/countyNetSupplyTable.html'], function(namespace, BaseSelectableRegionStrategyView, CountyNetSupplyView, CountyNetSupplyCollection, tpl) {
  var CountyNetSupplyCollectionView, _ref;
  return CountyNetSupplyCollectionView = (function(_super) {
    __extends(CountyNetSupplyCollectionView, _super);

    function CountyNetSupplyCollectionView() {
      _ref = CountyNetSupplyCollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    CountyNetSupplyCollectionView.prototype.initialize = function(options) {
      CountyNetSupplyCollectionView.__super__.initialize.call(this, CountyNetSupplyView, CountyNetSupplyCollection, tpl, namespace.mapView);
    };

    return CountyNetSupplyCollectionView;

  })(BaseSelectableRegionStrategyView);
});
