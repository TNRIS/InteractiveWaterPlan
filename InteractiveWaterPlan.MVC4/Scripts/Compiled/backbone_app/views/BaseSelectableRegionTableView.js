// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'collections/RegionFeatureCollection', 'views/BaseTableCollectionView'], function(namespace, RegionFeatureCollection, BaseTableCollectionView) {
  var BaseSelectableRegionTableView;
  return BaseSelectableRegionTableView = (function(_super) {

    __extends(BaseSelectableRegionTableView, _super);

    function BaseSelectableRegionTableView() {
      return BaseSelectableRegionTableView.__super__.constructor.apply(this, arguments);
    }

    BaseSelectableRegionTableView.prototype.initialize = function(ModelView, Collection, tpl, mapView, options) {
      BaseSelectableRegionTableView.__super__.initialize.call(this, ModelView, Collection, tpl, options);
      _.bindAll(this, 'onRegionCollectionSuccess', 'onStrategyCollectionSuccess');
      this.mapView = mapView;
      this.regionCollection = null;
    };

    BaseSelectableRegionTableView.prototype.unrender = function() {
      if (this.regionHighlightControl != null) {
        this.regionHighlightControl.destroy();
      }
      if (this.regionClickControl != null) {
        this.regionClickControl.destroy();
      }
      if (this.regionLayer != null) {
        this.regionLayer.destroy();
      }
      return BaseSelectableRegionTableView.__super__.unrender.apply(this, arguments);
    };

    BaseSelectableRegionTableView.prototype.fetchCollection = function() {
      var deferred, params,
        _this = this;
      this.$('tbody').empty();
      params = _.extend({
        year: namespace.currYear
      }, this.fetchParams);
      this.trigger("table:startload");
      deferred = this.collection.fetch({
        data: params,
        success: this.onStrategyCollectionSuccess
      });
      deferred.then(function() {
        _this.trigger("table:endload");
      }).fail(function() {
        _this.trigger("table:fetcherror");
      });
    };

    BaseSelectableRegionTableView.prototype.onStrategyCollectionSuccess = function(collection) {
      var m, _i, _len, _ref,
        _this = this;
      if (collection.models.length === 0) {
        this.trigger("table:nothingfound");
      } else {
        _ref = collection.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          m = _ref[_i];
          this.appendModel(m);
        }
        this.$('.has-popover').popover({
          trigger: 'hover'
        });
        this._setupDataTable();
        if (namespace.regionFeatureCollection != null) {
          this.regionCollection = namespace.regionFeatureCollection;
          this.onRegionCollectionSuccess(this.regionCollection);
        } else {
          this.regionCollection = new RegionFeatureCollection();
          console.log("fetching regions");
          this.regionCollection.fetch({
            success: function(regionCollection) {
              namespace.regionFeatureCollection = regionCollection;
              _this.onRegionCollectionSuccess(regionCollection);
            }
          });
        }
      }
    };

    BaseSelectableRegionTableView.prototype.onRegionCollectionSuccess = function(regionCollection) {
      var newFeature, region, regionFeatures, wktFormat, _i, _len, _ref;
      wktFormat = new OpenLayers.Format.WKT();
      regionFeatures = [];
      _ref = regionCollection.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        region = _ref[_i];
        newFeature = wktFormat.read(region.get('wktGeog'));
        newFeature.attributes = _.clone(region.attributes);
        delete newFeature.attributes.wktGeog;
        newFeature.geometry = this.mapView.transformToWebMerc(newFeature.geometry);
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

    return BaseSelectableRegionTableView;

  })(BaseTableCollectionView);
});
