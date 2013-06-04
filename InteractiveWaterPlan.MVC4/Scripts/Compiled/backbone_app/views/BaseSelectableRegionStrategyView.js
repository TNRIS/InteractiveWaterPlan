var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'collections/RegionFeatureCollection', 'views/BaseStrategyCollectionView'], function(namespace, RegionFeatureCollection, BaseStrategyCollectionView) {
  var BaseSelectableRegionStrategyView, _ref;
  return BaseSelectableRegionStrategyView = (function(_super) {
    __extends(BaseSelectableRegionStrategyView, _super);

    function BaseSelectableRegionStrategyView() {
      _ref = BaseSelectableRegionStrategyView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BaseSelectableRegionStrategyView.prototype.initialize = function(ModelView, Collection, tpl, mapView, options) {
      BaseSelectableRegionStrategyView.__super__.initialize.call(this, ModelView, Collection, tpl, options);
      _.bindAll(this, 'showRegionFeatures', 'onStrategyCollectionSuccess');
      this.mapView = mapView;
      this.regionCollection = null;
    };

    BaseSelectableRegionStrategyView.prototype.unrender = function() {
      BaseSelectableRegionStrategyView.__super__.unrender.apply(this, arguments);
      if (this.regionHighlightControl != null) {
        this.regionHighlightControl.destroy();
      }
      if (this.regionClickControl != null) {
        this.regionClickControl.destroy();
      }
      if (this.regionLayer != null) {
        this.regionLayer.destroy();
      }
      return null;
    };

    BaseSelectableRegionStrategyView.prototype.fetchData = function() {
      var deferred, params,
        _this = this;
      this.$('tbody').empty();
      params = _.extend({
        year: namespace.currYear
      }, this.fetchParams);
      this.trigger("table:startload");
      deferred = this.strategyCollection.fetch({
        data: params,
        success: this.onStrategyCollectionSuccess
      });
      deferred.then(function() {
        _this.trigger("table:endload");
      }).fail(function() {
        _this.trigger("table:fetcherror");
      });
    };

    BaseSelectableRegionStrategyView.prototype.onStrategyCollectionSuccess = function(collection) {
      var m, _i, _len, _ref1;
      if (collection.models.length === 0) {
        this.trigger("table:nothingfound");
      } else {
        _ref1 = collection.models;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          m = _ref1[_i];
          this.appendModel(m);
          if (m.attributes.isRedundantSupply === 'Y') {
            this.$(".note-marker-container").show();
          }
        }
        this.$('.has-popover').popover({
          trigger: 'hover'
        });
        this._setupDataTable();
        this.regionCollection = namespace.regionFeatures;
        this.showRegionFeatures();
      }
    };

    BaseSelectableRegionStrategyView.prototype.showRegionFeatures = function() {
      var newFeature, region, regionFeatures, wktFormat, _i, _len, _ref1;
      wktFormat = new OpenLayers.Format.WKT();
      regionFeatures = [];
      _ref1 = this.regionCollection.models;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        region = _ref1[_i];
        newFeature = wktFormat.read(region.get('wktGeog'));
        newFeature.attributes = _.clone(region.attributes);
        delete newFeature.attributes.wktGeog;
        this.mapView.transformToWebMerc(newFeature.geometry);
        regionFeatures.push(newFeature);
      }
      this.regionLayer = new OpenLayers.Layer.Vector("Region Feature Layer", {
        displayInLayerSwitcher: false,
        styleMap: new OpenLayers.StyleMap({
          "default": new OpenLayers.Style({
            strokeColor: "gray",
            strokeWidth: 0,
            fillColor: "white",
            fillOpacity: 0
          }),
          "select": new OpenLayers.Style({
            fillColor: "yellow",
            strokeColor: "orange",
            strokeWidth: 2,
            fillOpacity: 0.2
          })
        })
      });
      this.regionLayer.addFeatures(regionFeatures);
      this.mapView.map.addLayer(this.regionLayer);
      this.regionHighlightControl = new OpenLayers.Control.SelectFeature(this.regionLayer, {
        autoActivate: true,
        hover: true
      });
      this.mapView.map.addControl(this.regionHighlightControl);
      this.regionHighlightControl.handlers.feature.stopDown = false;
      this.regionClickControl = new OpenLayers.Control.SelectFeature(this.regionLayer, {
        autoActivate: true,
        clickFeature: function(regionFeature) {
          var regionLetter;
          regionLetter = regionFeature.attributes.letter;
          Backbone.history.navigate("#/" + namespace.currYear + "/wms/region/" + regionLetter, {
            trigger: true
          });
        }
      });
      this.mapView.map.addControl(this.regionClickControl);
      this.regionClickControl.handlers.feature.stopDown = false;
    };

    return BaseSelectableRegionStrategyView;

  })(BaseStrategyCollectionView);
});
