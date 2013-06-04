var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyCollectionView', 'views/ProjectStrategyView', 'scripts/text!templates/projectStrategyTable.html'], function(namespace, BaseStrategyCollectionView, ProjectStrategyView, tpl) {
  var ProjectStrategyCollectionView, _ref;
  return ProjectStrategyCollectionView = (function(_super) {
    __extends(ProjectStrategyCollectionView, _super);

    function ProjectStrategyCollectionView() {
      _ref = ProjectStrategyCollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ProjectStrategyCollectionView.prototype.initialize = function(options) {
      var ProjectStrategyCollection, SourceCollection, fetchParams;
      _.bindAll(this, 'fetchCallback', 'onFetchBothCollectionSuccess', 'showSourceFeatures', '_registerHighlightEvents', '_clickFeature');
      this.projectId = options.id;
      this.viewName = ko.observable();
      fetchParams = {
        projectId: this.projectId
      };
      ProjectStrategyCollection = Backbone.Collection.extend({
        url: "" + BASE_PATH + "api/strategies/project"
      });
      SourceCollection = Backbone.Collection.extend({
        url: "" + BASE_PATH + "api/project/" + this.projectId + "/sources"
      });
      this.sourceCollection = new SourceCollection();
      ProjectStrategyCollectionView.__super__.initialize.call(this, ProjectStrategyView, ProjectStrategyCollection, tpl, {
        fetchParams: fetchParams
      });
      return null;
    };

    ProjectStrategyCollectionView.prototype.fetchData = function() {
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

    ProjectStrategyCollectionView.prototype.unrender = function() {
      ProjectStrategyCollectionView.__super__.unrender.apply(this, arguments);
      if (this.sourceLayer != null) {
        this.sourceLayer.destroy();
      }
    };

    ProjectStrategyCollectionView.prototype.onFetchBothCollectionSuccess = function() {
      if (this.onFetchDataSuccess(this.strategyCollection) === false) {
        return;
      }
      this.showSourceFeatures();
      this.trigger("table:endload");
    };

    ProjectStrategyCollectionView.prototype.fetchCallback = function(strategyModels) {
      if (strategyModels.length < (1 != null)) {
        alert("Invalid projectId specified.");
        Backbone.history.navigate("", {
          trigger: true
        });
      }
      this.viewName(strategyModels[0].get("description"));
      ProjectStrategyCollectionView.__super__.fetchCallback.call(this, strategyModels);
    };

    ProjectStrategyCollectionView.prototype.showSourceFeatures = function() {
      var bounds, newFeature, source, sourceFeatures, wktFormat, wugFeature, _i, _j, _len, _len1, _ref1, _ref2;
      wktFormat = new OpenLayers.Format.WKT();
      bounds = null;
      sourceFeatures = [];
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
        delete newFeature.attributes.wktGeog;
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

    ProjectStrategyCollectionView.prototype._clickFeature = function(feature) {
      var sourceId;
      ProjectStrategyCollectionView.__super__._clickFeature.call(this, feature);
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

    ProjectStrategyCollectionView.prototype._registerHighlightEvents = function() {
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

    return ProjectStrategyCollectionView;

  })(BaseStrategyCollectionView);
});
