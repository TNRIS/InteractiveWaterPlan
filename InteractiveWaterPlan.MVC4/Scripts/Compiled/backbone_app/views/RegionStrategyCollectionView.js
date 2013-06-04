var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseSelectableRegionStrategyView', 'views/RegionStrategyView', 'scripts/text!templates/regionStrategyTable.html'], function(namespace, BaseSelectableRegionStrategyView, RegionStrategyView, tpl) {
  var RegionStrategyCollectionView, _ref;
  return RegionStrategyCollectionView = (function(_super) {
    __extends(RegionStrategyCollectionView, _super);

    function RegionStrategyCollectionView() {
      _ref = RegionStrategyCollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    RegionStrategyCollectionView.prototype.initialize = function(options) {
      var StrategyCollection, fetchParams;
      this.regionLetter = options.id;
      this.viewName = ko.observable("Region " + this.regionLetter);
      fetchParams = {
        regionLetter: this.regionLetter
      };
      StrategyCollection = Backbone.Collection.extend({
        url: "" + BASE_PATH + "api/strategies/region"
      });
      RegionStrategyCollectionView.__super__.initialize.call(this, RegionStrategyView, StrategyCollection, tpl, namespace.mapView, {
        fetchParams: fetchParams
      });
      return null;
    };

    RegionStrategyCollectionView.prototype.showRegionFeatures = function() {
      var bounds, matchedRegion,
        _this = this;
      RegionStrategyCollectionView.__super__.showRegionFeatures.apply(this, arguments);
      matchedRegion = _.find(this.regionLayer.features, function(regionFeature) {
        return regionFeature.attributes.letter === _this.regionLetter;
      });
      this.regionHighlightControl.select(matchedRegion);
      bounds = matchedRegion.geometry.getBounds();
      if (bounds != null) {
        this.mapView.zoomToExtent(bounds);
      }
    };

    return RegionStrategyCollectionView;

  })(BaseSelectableRegionStrategyView);
});
