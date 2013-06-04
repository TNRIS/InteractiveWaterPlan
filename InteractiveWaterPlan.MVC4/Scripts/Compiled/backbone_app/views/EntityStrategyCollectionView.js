var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyCollectionView', 'views/EntityStrategyView', 'scripts/text!templates/entityStrategyTable.html'], function(namespace, BaseStrategyCollectionView, EntityStrategyView, tpl) {
  var EntityStrategyCollectionView, _ref;
  return EntityStrategyCollectionView = (function(_super) {
    __extends(EntityStrategyCollectionView, _super);

    function EntityStrategyCollectionView() {
      _ref = EntityStrategyCollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    EntityStrategyCollectionView.prototype.initialize = function(options) {
      var SourceCollection, StrategyCollection, fetchParams;
      _.bindAll(this, 'fetchCallback', 'onFetchBothCollectionSuccess', 'showSourceFeatures', '_registerHighlightEvents');
      this.entityId = options.id;
      this.viewName = ko.observable();
      this.mapView = namespace.mapView;
      fetchParams = {
        entityId: this.entityId
      };
      StrategyCollection = Backbone.Collection.extend({
        url: "" + BASE_PATH + "api/strategies/entity"
      });
      SourceCollection = Backbone.Collection.extend({
        url: "" + BASE_PATH + "api/entity/" + this.entityId + "/sources"
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
      var bounds, curveFeature, lineFeatures, newFeature, source, sourceFeatures, sourcePoint, wktFormat, wugFeat, wugFeature, _i, _len, _ref1;
      wktFormat = new OpenLayers.Format.WKT();
      bounds = null;
      sourceFeatures = [];
      lineFeatures = [];
      wugFeature = this.wugLayer.features[0];
      _ref1 = this.sourceCollection.models;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        source = _ref1[_i];
        if (source.get('wktGeog') == null) {
          continue;
        }
        newFeature = wktFormat.read(source.get('wktGeog'));
        if ((newFeature == null) || (newFeature.geometry == null)) {
          continue;
        }
        newFeature.attributes = _.clone(source.attributes);
        if (source.attributes.wktMappingPoint != null) {
          sourcePoint = wktFormat.read(source.attributes.wktMappingPoint);
          this.mapView.transformToWebMerc(sourcePoint.geometry);
          curveFeature = this._createBezierConnector(wugFeature.geometry, sourcePoint.geometry);
          lineFeatures.push(curveFeature);
        }
        delete newFeature.attributes.wktGeog;
        delete newFeature.attributes.wktMappingPoint;
        this.mapView.transformToWebMerc(newFeature.geometry);
        if (bounds == null) {
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
      this._registerHighlightEvents();
      this._addLayerToControl(this.clickFeatureControl, this.sourceLayer);
      if (bounds != null) {
        wugFeat = this.wugLayer.features[0];
        bounds.extend(wugFeat.geometry.getBounds());
        this.mapView.zoomToExtent(bounds);
      }
    };

    EntityStrategyCollectionView.prototype._clickFeature = function(feature) {
      var sourceId;
      EntityStrategyCollectionView.__super__._clickFeature.call(this, feature);
      if ((feature.layer == null) || feature.layer.id !== this.sourceLayer.id) {
        return;
      }
      if ((feature.attributes.featureType != null) && feature.attributes.featureType === "connector") {
        return;
      }
      sourceId = feature.attributes.sourceId;
      Backbone.history.navigate("#/" + namespace.currYear + "/wms/source/" + sourceId, {
        trigger: true
      });
    };

    EntityStrategyCollectionView.prototype._registerHighlightEvents = function() {
      var _this = this;
      this._addLayerToControl(this.highlightFeatureControl, this.sourceLayer);
      this.highlightFeatureControl.events.register('beforefeaturehighlighted', null, function(event) {
        var feature;
        if ((event.feature.layer == null) || event.feature.layer.id !== _this.sourceLayer.id) {
          return true;
        }
        feature = event.feature;
        if ((feature.attributes.featureType != null) && feature.attributes.featureType === "connector") {
          return false;
        }
        return true;
      });
      this.highlightFeatureControl.events.register('featurehighlighted', null, function(event) {
        var popup, sourceDisplayName, sourceFeature;
        if ((event.feature.layer == null) || event.feature.layer.id !== _this.sourceLayer.id) {
          return;
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
          return;
        }
        sourceFeature = event.feature;
        if (sourceFeature.popup != null) {
          _this.mapView.map.removePopup(sourceFeature.popup);
          sourceFeature.popup.destroy();
          sourceFeature.popup = null;
        }
      });
    };

    return EntityStrategyCollectionView;

  })(BaseStrategyCollectionView);
});
