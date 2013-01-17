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

    MapView.prototype.MAX_WUG_RADIUS = 18;

    MapView.prototype.MIN_WUG_RADIUS = 6;

    MapView.prototype.initialize = function(config) {
      this.$el = $("#" + config.mapContainerId);
      this.el = this.$el[0];
      this.bingApiKey = config.bingApiKey;
      _.bindAll(this, 'render', 'unrender', 'resetExtent', 'showPlaceFeature', 'transformToWebMerc', 'resetWugFeatures', 'clearWugFeatures', 'selectWugFeature', 'unselectWugFeatures', '_setupWugHighlightControl', '_setupOverlayLayers', 'showWmsOverlayByViewType', 'hideWmsOverlays', 'showMapLoading', 'hideMapLoading', '_setupWugClickControl');
      namespace.wugFeatureCollection.on('reset', this.resetWugFeatures);
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

    MapView.prototype.resetWugFeatures = function(featureCollection) {
      var bounds, m, max_supply, min_supply, newFeature, wktFormat, wugFeatures, _i, _len, _ref;
      this.clearWugFeatures();
      if (featureCollection.models.length < 1) {
        return;
      }
      this.wugLayer = new OpenLayers.Layer.Vector("Water User Groups", {
        styleMap: this._wugStyleMap,
        displayInLayerSwitcher: false
      });
      wktFormat = new OpenLayers.Format.WKT();
      max_supply = featureCollection.max(function(m) {
        return m.get("sourceSupply");
      }).get("sourceSupply");
      min_supply = featureCollection.min(function(m) {
        return m.get("sourceSupply");
      }).get("sourceSupply");
      bounds = null;
      wugFeatures = [];
      _ref = featureCollection.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        m = _ref[_i];
        newFeature = wktFormat.read(m.get('wktGeog'));
        newFeature.attributes = m.attributes;
        newFeature.size = this._calculateScaledValue(max_supply, min_supply, this.MAX_WUG_RADIUS, this.MIN_WUG_RADIUS, m.get("sourceSupply"));
        delete newFeature.attributes.wktGeog;
        newFeature.geometry = newFeature.geometry.transform(this.map.displayProjection, this.map.projection);
        if (!(bounds != null)) {
          bounds = newFeature.geometry.getBounds().clone();
        } else {
          bounds.extend(newFeature.geometry.getBounds());
        }
        wugFeatures.push(newFeature);
      }
      this.wugLayer.addFeatures(wugFeatures);
      this.map.addLayer(this.wugLayer);
      this.wugHighlightControl = this._setupWugHighlightControl();
      this.map.addControl(this.wugHighlightControl);
      this.wugClickControl = this._setupWugClickControl();
      this.map.addControl(this.wugClickControl);
      this.map.zoomToExtent(bounds);
    };

    MapView.prototype.clearWugFeatures = function() {
      this.unselectWugFeatures();
      if (this.wugHighlightControl != null) {
        this.wugHighlightControl.destroy();
        this.wugHighlightControl = null;
      }
      if (this.wugClickControl != null) {
        this.wugClickControl.destroy();
        this.wugClickControl = null;
      }
      if (this.wugLayer != null) {
        this.wugLayer.destroy();
      }
    };

    MapView.prototype.selectWugFeature = function(wugId) {
      var wugFeature, _i, _len, _ref;
      if (!(this.wugHighlightControl != null)) {
        return;
      }
      _ref = this.wugLayer.features;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        wugFeature = _ref[_i];
        if (wugFeature.attributes.id === wugId) {
          this.wugHighlightControl.select(wugFeature);
          return;
        }
      }
    };

    MapView.prototype.unselectWugFeatures = function() {
      if (!(this.wugHighlightControl != null) || !(this.wugHighlightControl.layer.selectedFeatures != null)) {
        return;
      }
      this.wugHighlightControl.unselectAll();
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
      _ref = this.map.getLayersBy("viewType", viewType);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        layer = _ref[_i];
        layer.setVisibility(true);
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

    MapView.prototype._setupWugClickControl = function() {
      var control,
        _this = this;
      control = new OpenLayers.Control.SelectFeature(this.wugLayer, {
        autoActivate: true,
        clickFeature: function(wugFeature) {
          var wugId;
          if ((wugFeature.attributes.type != null) && wugFeature.attributes.type === "WWP") {
            return;
          }
          wugId = wugFeature.attributes.id;
          Backbone.history.navigate("#/" + namespace.currYear + "/wms/entity/" + wugId, {
            trigger: true
          });
        }
      });
      return control;
    };

    MapView.prototype._setupWugHighlightControl = function() {
      var control, timer,
        _this = this;
      timer = null;
      control = new OpenLayers.Control.SelectFeature(this.wugLayer, {
        multiple: false,
        hover: true,
        autoActivate: true,
        overFeature: function(feature) {
          var layer,
            _this = this;
          layer = feature.layer;
          if (this.hover) {
            if (this.highlightOnly) {
              this.highlight(feature);
            } else if (OpenLayers.Util.indexOf(layer.selectedFeatures, feature) === -1) {
              timer = _.delay(function() {
                return _this.select(feature);
              }, 400);
            }
          }
        },
        onSelect: function(wugFeature) {
          var popup;
          popup = new OpenLayers.Popup.FramedCloud("wugpopup", wugFeature.geometry.getBounds().getCenterLonLat(), null, "                                <b>" + wugFeature.attributes.name + "</b><br/>                                " + namespace.currYear + " Supply: " + ($.number(wugFeature.attributes.sourceSupply)) + " ac-ft/yr                            ", null, false);
          popup.autoSize = true;
          wugFeature.popup = popup;
          _this.map.addPopup(popup);
        },
        onUnselect: function(wugFeature) {
          clearTimeout(timer);
          if (wugFeature.popup != null) {
            _this.map.removePopup(wugFeature.popup);
            wugFeature.popup.destroy();
            wugFeature.popup = null;
          }
        }
      });
      return control;
    };

    MapView.prototype._calculateScaledValue = function(max, min, scale_max, scale_min, val) {
      var scaled_val;
      if (max === min) {
        return scale_min;
      }
      scaled_val = (scale_max - scale_min) * (val - min) / (max - min) + scale_min;
      return scaled_val;
    };

    MapView.prototype.resetExtent = function() {
      var zoom;
      zoom = this.origZoom;
      if (this.map.baseLayer instanceof OpenLayers.Layer.Bing) {
        zoom = this.origZoom - 1;
      }
      this.map.setCenter(this.origCenter, zoom);
    };

    MapView.prototype.showPlaceFeature = function(placeFeature) {
      var bounds, feature, wktFormat;
      wktFormat = new OpenLayers.Format.WKT();
      feature = wktFormat.read(placeFeature.get('wktGeog'));
      this.transformToWebMerc(feature.geometry);
      bounds = feature.geometry.getBounds();
      this.map.zoomToExtent(bounds);
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
              attribution: "Tiles courtesy <a href='http://www.mapquest.com/' target='_blank'>MapQuest</a>",
              transitionEffect: "resize",
              isBaseLayer: true
            }));
            break;
          case 'mapquest_aerial':
            layers.push(new OpenLayers.Layer.XYZ("MapQuest Open Aerial", ["http://oatile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png", "http://oatile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png", "http://oatile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png", "http://oatile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png"], {
              attribution: "Tiles courtesy <a href='http://www.mapquest.com/' target='_blank'>MapQuest</a>",
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
              attribution: "Tiles courtesy <a href='http://www.esri.com' target='_blank'>esri</a>",
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

    MapView.prototype._wugStyleMap = new OpenLayers.StyleMap({
      "default": new OpenLayers.Style({
        pointRadius: '${getPointRadius}',
        strokeColor: "yellow",
        strokeWidth: 1,
        fillColor: "${getFillColor}",
        fillOpacity: 0.8
      }, {
        context: {
          getPointRadius: function(feature) {
            if (feature.size != null) {
              return feature.size;
            }
            return 6;
          },
          getFillColor: function(feature) {
            if ((feature.attributes.type != null) && feature.attributes.type === "WWP") {
              return 'gray';
            }
            return 'green';
          }
        },
        rules: [
          new OpenLayers.Rule({
            maxScaleDenominator: 866688,
            symbolizer: {
              fontSize: "11px",
              labelAlign: 'cb',
              labelOutlineColor: "yellow",
              labelOutlineWidth: 2,
              labelYOffset: 8,
              label: "${name}"
            }
          }), new OpenLayers.Rule({
            minScaleDenominator: 866688,
            symbolizer: {}
          })
        ]
      }),
      "select": new OpenLayers.Style({
        fillColor: "yellow",
        strokeColor: "green",
        fillOpacity: 1
      })
    });

    return MapView;

  })(Backbone.View);
});
