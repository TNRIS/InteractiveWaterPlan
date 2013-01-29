// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'config/WmsThemeConfig', 'views/BaseStrategyCollectionView', 'views/EntityStrategyView', 'scripts/text!templates/entityStrategyTable.html'], function(namespace, WmsThemeConfig, BaseStrategyCollectionView, EntityStrategyView, tpl) {
  var EntityStrategyCollectionView;
  return EntityStrategyCollectionView = (function(_super) {

    __extends(EntityStrategyCollectionView, _super);

    function EntityStrategyCollectionView() {
      return EntityStrategyCollectionView.__super__.constructor.apply(this, arguments);
    }

    EntityStrategyCollectionView.prototype.initialize = function(options) {
      var SourceCollection, StrategyCollection, fetchParams;
      _.bindAll(this, 'fetchCallback', 'onFetchBothCollectionSuccess', 'showSourceFeatures', '_registerHighlightEvents', '_registerClickEvents');
      this.entityId = options.id;
      this.viewName = ko.observable();
      this.mapView = namespace.mapView;
      fetchParams = {
        entityId: this.entityId
      };
      StrategyCollection = Backbone.Collection.extend({
        url: "" + BASE_API_PATH + "api/strategies/entity"
      });
      SourceCollection = Backbone.Collection.extend({
        url: "" + BASE_API_PATH + "api/entity/" + this.entityId + "/sources"
      });
      this.sourceCollection = new SourceCollection();
      EntityStrategyCollectionView.__super__.initialize.call(this, EntityStrategyView, StrategyCollection, tpl, {
        fetchParams: fetchParams
      });
      return null;
    };

    EntityStrategyCollectionView.prototype.fetchData = function() {
      var params,
        _this = this;
      this.$('tbody').empty();
      params = _.extend({
        year: namespace.currYear
      }, this.fetchParams);
      this.trigger("table:startload");
      $.when(this.strategyCollection.fetch({
        data: params
      }), this.sourceCollection.fetch({
        data: {
          year: namespace.currYear
        }
      })).then(this.onFetchBothCollectionSuccess).fail(function() {
        _this.trigger("table:fetcherror");
      });
    };

    EntityStrategyCollectionView.prototype.unrender = function() {
      EntityStrategyCollectionView.__super__.unrender.apply(this, arguments);
      if (this.sourceLayer != null) {
        this.sourceLayer.destroy();
      }
      return null;
    };

    EntityStrategyCollectionView.prototype.onFetchBothCollectionSuccess = function() {
      if (this.onFetchDataSuccess(this.strategyCollection) === false) {
        return;
      }
      this.showSourceFeatures();
      this.trigger("table:endload");
    };

    EntityStrategyCollectionView.prototype.fetchCallback = function(strategyModels) {
      this.viewName(strategyModels[0].get("recipientEntityName"));
      EntityStrategyCollectionView.__super__.fetchCallback.call(this, strategyModels);
    };

    EntityStrategyCollectionView.prototype.showSourceFeatures = function() {
      var bounds, lineFeatures, newFeature, source, sourceFeatures, sourcePoint, wktFormat, wugFeat, wugFeature, _i, _len, _ref;
      wktFormat = new OpenLayers.Format.WKT();
      bounds = null;
      sourceFeatures = [];
      lineFeatures = [];
      wugFeature = this.wugLayer.features[0];
      _ref = this.sourceCollection.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        source = _ref[_i];
        if (!(source.get('wktGeog') != null)) {
          continue;
        }
        newFeature = wktFormat.read(source.get('wktGeog'));
        if (!(newFeature != null)) {
          continue;
        }
        newFeature.attributes = _.clone(source.attributes);
        if (source.attributes.wktMappingPoint != null) {
          sourcePoint = wktFormat.read(source.attributes.wktMappingPoint);
          sourcePoint.geometry = this.mapView.transformToWebMerc(sourcePoint.geometry);
          lineFeatures.push(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([sourcePoint.geometry, wugFeature.geometry]), {
            featureType: "connector"
          }));
        }
        delete newFeature.attributes.wktGeog;
        delete newFeature.attributes.wktMappingPoint;
        newFeature.geometry = this.mapView.transformToWebMerc(newFeature.geometry);
        if (!(bounds != null)) {
          bounds = newFeature.geometry.getBounds().clone();
        } else {
          bounds.extend(newFeature.geometry.getBounds());
        }
        sourceFeatures.push(newFeature);
      }
      sourceFeatures.sort(function(a, b) {
        if (a.attributes.sourceType === "SURFACE WATER") {
          return 1;
        }
        if (b.attributes.sourceType === "SURFACE WATER") {
          return -1;
        }
        return a.attributes.sourceTypeId - b.attributes.sourceTypeId;
      });
      this.sourceLayer = new OpenLayers.Layer.Vector("Source Feature Layer", {
        displayInLayerSwitcher: false,
        styleMap: this._sourceStyleMap
      });
      this.sourceLayer.addFeatures(sourceFeatures);
      this.sourceLayer.addFeatures(lineFeatures);
      this.mapView.map.addLayer(this.sourceLayer);
      this.mapView.map.setLayerIndex(this.wugLayer, +this.mapView.map.getLayerIndex(this.sourceLayer) + 1);
      this._addLayerToControl(this.highlightFeatureControl, this.sourceLayer);
      this._registerHighlightEvents();
      this._registerClickEvents();
      if (bounds != null) {
        wugFeat = this.wugLayer.features[0];
        bounds.extend(wugFeat.geometry.getBounds());
        this.mapView.zoomToExtent(bounds);
      }
    };

    EntityStrategyCollectionView.prototype._registerClickEvents = function() {};

    EntityStrategyCollectionView.prototype._registerHighlightEvents = function() {
      var _this = this;
      this.highlightFeatureControl.events.register('beforefeaturehighlighted', null, function(event) {
        var feature;
        feature = event.feature;
        if ((feature.attributes.featureType != null) && feature.attributes.featureType === "connector") {
          return false;
        }
        return true;
      });
      this.highlightFeatureControl.events.register('featurehighlighted', null, function(event) {
        var popup, sourceFeature;
        if (event.feature.layer.id !== _this.sourceLayer.id) {
          return false;
        }
        sourceFeature = event.feature;
        popup = new OpenLayers.Popup.FramedCloud("sourcepopup", _this.mapView.getMouseLonLat(), null, "                        <b>" + sourceFeature.attributes.name + "</b><br/>                        " + namespace.currYear + " Supply to Water User Group:                         " + ($.number(sourceFeature.attributes.supplyInYear)) + " ac-ft/yr                    ", null, false);
        popup.autoSize = true;
        sourceFeature.popup = popup;
        _this.mapView.map.addPopup(popup);
      });
      this.highlightFeatureControl.events.register('featureunhighlighted', null, function(event) {
        var sourceFeature;
        if (event.feature.layer.id !== _this.sourceLayer.id) {
          return false;
        }
        sourceFeature = event.feature;
        if (sourceFeature.popup != null) {
          _this.mapView.map.removePopup(sourceFeature.popup);
          sourceFeature.popup.destroy();
          sourceFeature.popup = null;
        }
      });
    };

    EntityStrategyCollectionView.prototype._sourceStyleMap = new OpenLayers.StyleMap({
      "default": new OpenLayers.Style({
        strokeColor: "${getStrokeColor}",
        strokeWidth: "${getStrokeWidth}",
        fillColor: "${getFillColor}",
        fillOpacity: 0.8
      }, {
        context: {
          getStrokeColor: function(feature) {
            var style;
            if ((feature.attributes.featureType != null) && feature.attributes.featureType === "connector") {
              return "#ee9900";
            }
            style = _.find(WmsThemeConfig.SourceStyles, function(style) {
              return style.id === feature.attributes.sourceTypeId;
            });
            if (style != null) {
              return style.strokeColor;
            }
            return WmsThemeConfig.SourceStyles[0].strokeColor;
          },
          getStrokeWidth: function(feature) {
            var style;
            style = _.find(WmsThemeConfig.SourceStyles, function(style) {
              return style.id === feature.attributes.sourceTypeId;
            });
            if (style != null) {
              return style.strokeWidth;
            }
            return WmsThemeConfig.SourceStyles[0].strokeWidth;
          },
          getFillColor: function(feature) {
            var style;
            style = _.find(WmsThemeConfig.SourceStyles, function(style) {
              return style.id === feature.attributes.sourceTypeId;
            });
            if (style != null) {
              return style.fillColor;
            }
            return WmsThemeConfig.SourceStyles[0].fillColor;
          }
        }
      }),
      "select": new OpenLayers.Style({
        fillColor: "cyan",
        strokeColor: "blue"
      })
    });

    return EntityStrategyCollectionView;

  })(BaseStrategyCollectionView);
});
