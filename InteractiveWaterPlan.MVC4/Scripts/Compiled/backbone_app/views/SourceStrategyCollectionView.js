// Generated by CoffeeScript 1.6.2
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'config/WmsThemeConfig', 'views/BaseStrategyCollectionView', 'views/SourceStrategyView', 'scripts/text!templates/sourceStrategyTable.html'], function(namespace, WmsThemeConfig, BaseStrategyCollectionView, SourceStrategyView, tpl) {
  var SourceStrategyCollectionView, _ref;

  return SourceStrategyCollectionView = (function(_super) {
    __extends(SourceStrategyCollectionView, _super);

    function SourceStrategyCollectionView() {
      _ref = SourceStrategyCollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SourceStrategyCollectionView.prototype.initialize = function(options) {
      var SourceModel, StrategyCollection, fetchParams;

      _.bindAll(this, 'onFetchBothCollectionSuccess', 'showSourceFeature', '_registerHighlightEvents');
      this.sourceId = options.id;
      this.viewName = ko.observable();
      this.mapView = namespace.mapView;
      fetchParams = {
        sourceId: this.sourceId
      };
      StrategyCollection = Backbone.Collection.extend({
        url: "" + BASE_PATH + "api/strategies/source"
      });
      SourceModel = Backbone.Model.extend({
        url: "" + BASE_PATH + "api/source/feature/" + this.sourceId
      });
      this.sourceModel = new SourceModel();
      SourceStrategyCollectionView.__super__.initialize.call(this, SourceStrategyView, StrategyCollection, tpl, {
        fetchParams: fetchParams
      });
    };

    SourceStrategyCollectionView.prototype.fetchData = function() {
      var params,
        _this = this;

      this.$('tbody').empty();
      params = _.extend({
        year: namespace.currYear
      }, this.fetchParams);
      this.trigger("table:startload");
      $.when(this.strategyCollection.fetch({
        data: params
      }), this.sourceModel.fetch()).then(this.onFetchBothCollectionSuccess).fail(function() {
        _this.trigger("table:fetcherror");
      });
    };

    SourceStrategyCollectionView.prototype.unrender = function() {
      SourceStrategyCollectionView.__super__.unrender.apply(this, arguments);
      if (this.sourceLayer != null) {
        this.sourceLayer.destroy();
      }
    };

    SourceStrategyCollectionView.prototype.onFetchBothCollectionSuccess = function() {
      if (this.onFetchDataSuccess(this.strategyCollection) === false) {
        return;
      }
      this.viewName(this.sourceModel.attributes.name);
      this.showSourceFeature();
      this.trigger("table:endload");
    };

    SourceStrategyCollectionView.prototype.showSourceFeature = function() {
      var bounds, lineFeatures, sourceFeature, sourcePoint, sourcePointText, stratModel, wktFormat, wugFeat, wugFeature, wugFeatures, wugPoint, wugPointText, _i, _j, _len, _len1, _ref1, _ref2;

      wktFormat = new OpenLayers.Format.WKT();
      bounds = null;
      lineFeatures = [];
      wugFeatures = this.wugLayer.features;
      if (this.sourceModel.get('wktGeog') == null) {
        return;
      }
      sourceFeature = wktFormat.read(this.sourceModel.get('wktGeog'));
      if (sourceFeature == null) {
        return;
      }
      sourceFeature.attributes = _.clone(this.sourceModel.attributes);
      delete sourceFeature.attributes.wktGeog;
      delete sourceFeature.attributes.wktMappingPoint;
      this.mapView.transformToWebMerc(sourceFeature.geometry);
      bounds = sourceFeature.geometry.getBounds().clone();
      _ref1 = this.wugLayer.features;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        wugFeature = _ref1[_i];
        bounds.extend(wugFeature.geometry.getBounds());
      }
      _ref2 = this.strategyCollection.models;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        stratModel = _ref2[_j];
        if (stratModel.get("recipientEntityType") === "WWP") {
          continue;
        }
        sourcePointText = stratModel.get("sourceMappingPoint");
        wugPointText = stratModel.get("recipientEntityWktGeog");
        if ((sourcePointText != null) && (wugPointText != null)) {
          sourcePoint = wktFormat.read(sourcePointText);
          wugPoint = wktFormat.read(wugPointText);
          this.mapView.transformToWebMerc(sourcePoint.geometry);
          this.mapView.transformToWebMerc(wugPoint.geometry);
          lineFeatures.push(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([sourcePoint.geometry, wugPoint.geometry]), {
            featureType: "connector"
          }));
        }
      }
      this.sourceLayer = new OpenLayers.Layer.Vector("Source Feature Layer", {
        displayInLayerSwitcher: false,
        styleMap: this._sourceStyleMap
      });
      this.sourceLayer.addFeatures(sourceFeature);
      this.sourceLayer.addFeatures(lineFeatures);
      this.mapView.map.addLayer(this.sourceLayer);
      this.mapView.map.setLayerIndex(this.wugLayer, +this.mapView.map.getLayerIndex(this.sourceLayer) + 1);
      this._registerHighlightEvents();
      this._addLayerToControl(this.clickFeatureControl, this.sourceLayer);
      if (bounds != null) {
        wugFeat = this.wugLayer.features[0];
        bounds.extend(wugFeat.geometry.getBounds());
        this.mapView.zoomToExtent(bounds);
      }
    };

    SourceStrategyCollectionView.prototype._registerHighlightEvents = function() {
      var _this = this;

      this._addLayerToControl(this.highlightFeatureControl, this.sourceLayer);
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

        if ((event.feature.layer == null) || event.feature.layer.id !== _this.sourceLayer.id) {
          return false;
        }
        sourceFeature = event.feature;
        popup = new OpenLayers.Popup.FramedCloud("sourcepopup", _this.mapView.getMouseLonLat(), null, "<strong>" + sourceFeature.attributes.name + "</strong>", null, true);
        popup.autoSize = true;
        sourceFeature.popup = popup;
        _this.mapView.map.addPopup(popup);
      });
      this.highlightFeatureControl.events.register('featureunhighlighted', null, function(event) {
        var sourceFeature;

        if ((event.feature.layer == null) || event.feature.layer.id !== _this.sourceLayer.id) {
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

    SourceStrategyCollectionView.prototype._sourceStyleMap = new OpenLayers.StyleMap({
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

    return SourceStrategyCollectionView;

  })(BaseStrategyCollectionView);
});
