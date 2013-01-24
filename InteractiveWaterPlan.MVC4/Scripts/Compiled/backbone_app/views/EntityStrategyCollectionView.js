// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyCollectionView', 'views/EntityStrategyView', 'scripts/text!templates/entityStrategyTable.html'], function(namespace, BaseStrategyCollectionView, EntityStrategyView, tpl) {
  var EntityStrategyCollectionView;
  return EntityStrategyCollectionView = (function(_super) {

    __extends(EntityStrategyCollectionView, _super);

    function EntityStrategyCollectionView() {
      return EntityStrategyCollectionView.__super__.constructor.apply(this, arguments);
    }

    EntityStrategyCollectionView.prototype.initialize = function(options) {
      var SourceCollection, StrategyCollection, fetchParams;
      _.bindAll(this, 'fetchCallback', 'onFetchBothCollectionSuccess', 'showSourceFeatures');
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
      }), this.sourceCollection.fetch()).then(this.onFetchBothCollectionSuccess).fail(function() {
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
      /*
                  style.addRules([
                      new OpenLayers.Rule({
                          symbolizer: 
                              Line:
                                  strokeWidth: 3
                                  strokeOpacity: 1
                                  strokeColor: "#666666"
                                  strokeDashstyle: "dash"
                              #TODO: This is just here as a reminder example 
                              #for how to do feature-type-based styling
                              Polygon: 
                                  strokeWidth: 2
                                  strokeOpacity: 1
                                  strokeColor: "#666666"
                                  fillColor: "white"
                                  fillOpacity: 0.3
                      })
                  ])
      */

      var bounds, newFeature, source, sourceFeatures, wktFormat, wugFeat, _i, _j, _len, _len1, _ref, _ref1;
      wktFormat = new OpenLayers.Format.WKT();
      bounds = null;
      sourceFeatures = [];
      _ref = this.sourceCollection.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        source = _ref[_i];
        if (!(source.get('wktGeog') != null)) {
          continue;
        }
        newFeature = wktFormat.read(source.get('wktGeog'));
        newFeature.attributes = _.clone(source.attributes);
        delete newFeature.attributes.wktGeog;
        newFeature.geometry = this.mapView.transformToWebMerc(newFeature.geometry);
        if (!(bounds != null)) {
          bounds = newFeature.geometry.getBounds().clone();
        } else {
          bounds.extend(newFeature.geometry.getBounds());
        }
        sourceFeatures.push(newFeature);
      }
      this.sourceLayer = new OpenLayers.Layer.Vector("Source Feature Layer", {
        displayInLayerSwitcher: false,
        styleMap: new OpenLayers.StyleMap({
          "default": new OpenLayers.Style({
            strokeColor: "cyan",
            strokeWidth: 1,
            fillColor: "blue",
            fillOpacity: 0.8
          }),
          "select": new OpenLayers.Style({
            fillColor: "cyan",
            strokeColor: "blue"
          })
        })
      });
      this.sourceLayer.addFeatures(sourceFeatures);
      this.mapView.map.addLayer(this.sourceLayer);
      this._addLayerToControl(this.highlightFeatureControl, this.sourceLayer);
      /* TODO: See notes above
      @sourceHighlightControl = new OpenLayers.Control.SelectFeature(
          @sourceLayer,
          {
              autoActivate: true
              hover: true
          })
      
      @mapView.map.addControl(@sourceHighlightControl)
      
      #OL workaround to allow dragging while over a feature
      # see http://trac.osgeo.org/openlayers/wiki/SelectFeatureControlMapDragIssues    
      @sourceHighlightControl.handlers.feature.stopDown = false;
      
      @sourceClickControl = new OpenLayers.Control.SelectFeature(
          @sourceLayer,
          {
              autoActivate: true
              
              clickFeature: (sourceFeature) ->
                  #else navigate to Source Details view when feature is clicked
                  sourceId = sourceFeature.attributes.sourceId
                  #TODO: navigate to source page
                  #Backbone.history.navigate("#/#{namespace.currYear}/wms/source/#{sourceId}", 
                  #    {trigger: true})
      
                  return
          })
      
      @mapView.map.addControl(@sourceClickControl)
      
      #OL workaround again
      @sourceClickControl.handlers.feature.stopDown = false;
      */

      if (bounds != null) {
        _ref1 = this.wugLayer.features;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          wugFeat = _ref1[_j];
          bounds.extend(wugFeat.geometry.getBounds());
        }
        this.mapView.zoomToExtent(bounds);
      }
    };

    return EntityStrategyCollectionView;

  })(BaseStrategyCollectionView);
});
