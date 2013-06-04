var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyCollectionView', 'views/SourceStrategyView', 'scripts/text!templates/sourceStrategyTable.html'], function(namespace, BaseStrategyCollectionView, SourceStrategyView, tpl) {
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
      this.qualifier = ko.observable();
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
      if (this.sourceModel.attributes.sourceType === "GROUNDWATER") {
        this.qualifier("in county shown");
      }
      this.showSourceFeature();
      this.trigger("table:endload");
    };

    SourceStrategyCollectionView.prototype.showSourceFeature = function() {
      var bounds, curveFeature, lineFeatures, sourceFeature, sourcePoint, sourcePointText, stratModel, wktFormat, wugFeature, wugPoint, wugPointText, _i, _j, _len, _len1, _ref1, _ref2;
      wktFormat = new OpenLayers.Format.WKT();
      bounds = null;
      lineFeatures = [];
      if (this.sourceModel.get('wktGeog') == null) {
        return;
      }
      sourceFeature = wktFormat.read(this.sourceModel.get('wktGeog'));
      if ((sourceFeature == null) || (sourceFeature.geometry == null)) {
        return;
      }
      sourceFeature.attributes = _.clone(this.sourceModel.attributes);
      delete sourceFeature.attributes.wktGeog;
      delete sourceFeature.attributes.wktMappingPoint;
      this.mapView.transformToWebMerc(sourceFeature.geometry);
      bounds = sourceFeature.geometry.getBounds().clone();
      _ref1 = this.strategyCollection.models;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        stratModel = _ref1[_i];
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
          curveFeature = this._createBezierConnector(sourcePoint.geometry, wugPoint.geometry);
          lineFeatures.push(curveFeature);
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
      if ((bounds != null) && (this.wugLayer != null) && this.wugLayer.features.length > 0) {
        _ref2 = this.wugLayer.features;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          wugFeature = _ref2[_j];
          bounds.extend(wugFeature.geometry.getBounds());
        }
      }
      if (bounds != null) {
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
        var popup, sourceDisplayName, sourceFeature;
        if ((event.feature.layer == null) || event.feature.layer.id !== _this.sourceLayer.id) {
          return false;
        }
        sourceFeature = event.feature;
        sourceDisplayName = _this._formatDisplayName(sourceFeature.attributes.name);
        popup = new OpenLayers.Popup.FramedCloud("sourcepopup", _this.mapView.getMouseLonLat(), null, "<strong>" + sourceDisplayName + "</strong>", null, true);
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

    return SourceStrategyCollectionView;

  })(BaseStrategyCollectionView);
});
