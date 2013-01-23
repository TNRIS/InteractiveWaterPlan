// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'config/WmsThemeConfig'], function(namespace, WmsThemeConfig) {
  var MapView;
  return MapView = (function(_super) {

    __extends(MapView, _super);

    function MapView() {
      return MapView.__super__.constructor.apply(this, arguments);
    }

    MapView.prototype.origCenter = new OpenLayers.LonLat(-99.294317, 31.348335).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:3857"));

    MapView.prototype.origZoom = 5;

    MapView.prototype.map = null;

    MapView.prototype.bingApiKey = '';

    MapView.prototype.baseLayers = ['esri_gray', 'mapquest_open', 'mapquest_aerial', 'bing_road', 'bing_hybrid', 'bing_aerial'];

    MapView.prototype.isMapLocked = false;

    MapView.prototype.initialize = function(config) {
      this.$el = $("#" + config.mapContainerId);
      this.el = this.$el[0];
      this.bingApiKey = config.bingApiKey;
      _.bindAll(this, 'render', 'unrender', 'resetExtent', 'showPlaceFeature', 'transformToWebMerc', '_setupOverlayLayers', 'showWmsOverlayByViewType', 'hideWmsOverlays', 'showMapLoading', 'hideMapLoading', 'zoomToExtent');
      return null;
    };

    MapView.prototype.render = function() {
      this.$el.empty();
      this.map = new OpenLayers.Map({
        div: this.$el[0],
        projection: new OpenLayers.Projection("EPSG:3857"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        layers: this._setupBaseLayers(this.baseLayers),
        center: this.origCenter,
        zoom: this.origZoom,
        eventListeners: {}
      });
      this._setupOverlayLayers();
      this.map.addControl(new OpenLayers.Control.LayerSwitcher());
      return this;
    };

    MapView.prototype.unrender = function() {
      this.$el.remove();
      return null;
    };

    MapView.prototype.hideWmsOverlays = function() {
      var layer, _i, _len, _ref;
      _ref = this.map.layers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        layer = _ref[_i];
        if (!layer.isBaseLayer) {
          layer.setVisibility(false);
        }
      }
    };

    MapView.prototype.showWmsOverlayByViewType = function(viewType) {
      var layer, _i, _len, _ref;
      _ref = this.map.layers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        layer = _ref[_i];
        if (layer.viewType === viewType) {
          layer.setVisibility(true);
        } else if (!layer.isBaseLayer) {
          layer.setVisibility(false);
        }
      }
    };

    MapView.prototype._setupOverlayLayers = function() {
      var layerConfig, overlay, _i, _len, _ref;
      _ref = WmsThemeConfig.Layers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        layerConfig = _ref[_i];
        switch (layerConfig.type) {
          case "WMS":
            overlay = new OpenLayers.Layer.WMS(layerConfig.name, layerConfig.url, layerConfig.service_params, layerConfig.layer_params);
            overlay.viewType = layerConfig.viewType;
            this.map.addLayer(overlay);
            break;
          default:
            throw "Unsupported Layer Type";
        }
      }
    };

    MapView.prototype.resetExtent = function() {
      var zoom;
      zoom = this.origZoom;
      if (this.map.baseLayer instanceof OpenLayers.Layer.Bing) {
        zoom = this.origZoom - 1;
      }
      this.map.setCenter(this.origCenter, zoom);
    };

    MapView.prototype.zoomToExtent = function(bounds) {
      if (!this.isMapLocked) {
        this.map.zoomToExtent(bounds);
      }
    };

    MapView.prototype.showPlaceFeature = function(placeFeature) {
      var bounds, feature, wktFormat;
      wktFormat = new OpenLayers.Format.WKT();
      feature = wktFormat.read(placeFeature.get('wktGeog'));
      this.transformToWebMerc(feature.geometry);
      bounds = feature.geometry.getBounds();
      this.zoomToExtent(bounds);
    };

    MapView.prototype.transformToWebMerc = function(geometry) {
      return geometry.transform(this.map.displayProjection, this.map.projection);
    };

    MapView.prototype.showMapLoading = function() {
      if (!(this.$loadingOverlay != null)) {
        this.$loadingOverlay = $('<div></div>');
        this.$loadingOverlay.height(this.$el.height()).width(this.$el.width());
        this.$loadingOverlay.addClass('mapLoadingOverlay');
        this.$el.prepend(this.$loadingOverlay);
      }
    };

    MapView.prototype.hideMapLoading = function() {
      if (this.$loadingOverlay != null) {
        this.$loadingOverlay.remove();
        this.$loadingOverlay = null;
      }
    };

    MapView.prototype._setupBaseLayers = function(baseLayers) {
      var layer_name, layers, _i, _len;
      layers = [];
      if (!(baseLayers != null) || baseLayers.length === 0) {
        throw new Error("Must specify baseLayers.");
      }
      for (_i = 0, _len = baseLayers.length; _i < _len; _i++) {
        layer_name = baseLayers[_i];
        switch (layer_name) {
          case 'mapquest_open':
            layers.push(new OpenLayers.Layer.XYZ("MapQuest Open Street", ["http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png", "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png", "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png", "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png"], {
              attribution: "Data, imagery, and map information provided by \n<a href='http://www.mapquest.com' target='_blank'>MapQuest</a>, \n<a href='http://www.openstreetmap.org' target='_blank'>Open Street Map</a> \nand contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' \ntarget='_blank'>CC-BY-SA</a>",
              transitionEffect: "resize",
              isBaseLayer: true
            }));
            break;
          case 'mapquest_aerial':
            layers.push(new OpenLayers.Layer.XYZ("MapQuest Open Aerial", ["http://oatile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png", "http://oatile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png", "http://oatile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png", "http://oatile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png"], {
              attribution: "Tiles Courtesy of <a href='http://www.mapquest.com/'' target='_blank'>MapQuest</a>.\nPortions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency",
              transitionEffect: "resize",
              isBaseLayer: true
            }));
            break;
          case 'bing_road':
            layers.push(new OpenLayers.Layer.Bing({
              name: "Bing Road",
              key: this.bingApiKey,
              type: "Road",
              transitionEffect: "resize",
              isBaseLayer: true
            }));
            break;
          case 'bing_hybrid':
            layers.push(new OpenLayers.Layer.Bing({
              name: "Bing Hybrid",
              key: this.bingApiKey,
              type: "AerialWithLabels",
              transitionEffect: "resize",
              isBaseLayer: true
            }));
            break;
          case 'bing_aerial':
            layers.push(new OpenLayers.Layer.Bing({
              name: "Bing Aerial",
              key: this.bingApiKey,
              type: "Aerial",
              transitionEffect: "resize",
              isBaseLayer: true
            }));
            break;
          case 'esri_gray':
            layers.push(new OpenLayers.Layer.XYZ('ESRI Gray', ['http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/${z}/${y}/${x}'], {
              attribution: "Tiles Courtesy of <a href='http://www.esri.com' target='_blank'>esri</a>",
              isBaseLayer: true
            }));
            break;
          case 'stamen_toner':
            layers.push(new OpenLayers.Layer.Stamen("toner-lite", "Stamen Toner"));
            break;
          case 'stamen_watercolor':
            layers.push(new OpenLayers.Layer.Stamen("watercolor", "Stamen Watercolor"));
        }
      }
      return layers;
    };

    return MapView;

  })(Backbone.View);
});
