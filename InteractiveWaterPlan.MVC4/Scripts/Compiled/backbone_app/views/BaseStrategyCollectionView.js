// Generated by CoffeeScript 1.4.0
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace'], function(namespace) {
  var BaseStrategyCollectionView;
  return BaseStrategyCollectionView = (function(_super) {

    __extends(BaseStrategyCollectionView, _super);

    function BaseStrategyCollectionView() {
      return BaseStrategyCollectionView.__super__.constructor.apply(this, arguments);
    }

    BaseStrategyCollectionView.prototype.MAX_WUG_RADIUS = 18;

    BaseStrategyCollectionView.prototype.MIN_WUG_RADIUS = 6;

    BaseStrategyCollectionView.prototype.initialize = function(ModelView, StrategyCollection, tpl, options) {
      _.bindAll(this, 'render', 'unrender', 'fetchData', 'appendModel', 'hideLoading', 'showLoading', 'onFetchDataSuccess', 'fetchCallback', '_setupDataTable', '_connectTableRowsToWugFeatures', 'showNothingFound', 'hideNothingFound', '_setupClickFeatureControl', 'showWugFeatures', '_clearWugFeaturesAndControls', '_setupWugClickControl', 'selectWugFeature', 'unselectWugFeatures', '_setupWugHighlightContol', 'highlightStratTypeWugs', 'unhighlightStratTypeWugs', '_setupHighlightFeatureControl', '_clickFeature');
      options = options || {};
      this.fetchParams = options.fetchParams || {};
      this.mapView = namespace.mapView;
      this.currYear = ko.observable(namespace.currYear);
      this.template = _.template(tpl);
      this.strategyCollection = new StrategyCollection();
      this.wugCollection = new Backbone.Collection();
      this.ModelView = ModelView;
      return null;
    };

    BaseStrategyCollectionView.prototype.render = function() {
      this.$el.html(this.template());
      this.fetchData();
      ko.applyBindings(this, this.el);
      this.$('.has-popover').popover({
        trigger: 'hover',
        placement: 'top'
      });
      return this;
    };

    BaseStrategyCollectionView.prototype.unrender = function() {
      this._clearWugFeaturesAndControls();
      this.$el.html();
      return null;
    };

    BaseStrategyCollectionView.prototype._clearWugFeaturesAndControls = function() {
      this.unselectWugFeatures();
      if (this.highlightFeatureControl != null) {
        this.highlightFeatureControl.destroy();
        this.highlightFeatureControl = null;
      }
      if (this.clickFeatureControl != null) {
        this.clickFeatureControl.destroy();
        this.clickFeatureControl = null;
      }
      if (this.wugLayer != null) {
        this.wugLayer.destroy();
      }
    };

    BaseStrategyCollectionView.prototype.fetchData = function() {
      var params,
        _this = this;
      this.$('tbody').empty();
      params = _.extend({
        year: namespace.currYear
      }, this.fetchParams);
      this.trigger("table:startload");
      this.strategyCollection.fetch({
        data: params,
        success: this.onFetchDataSuccess,
        error: function() {
          _this.trigger("table:fetcherror");
        }
      });
    };

    BaseStrategyCollectionView.prototype.onFetchDataSuccess = function(strategyCollection) {
      var m, _i, _len, _ref;
      if (strategyCollection.models.length === 0) {
        this.trigger("table:nothingfound");
        return false;
      }
      _ref = strategyCollection.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        m = _ref[_i];
        this.appendModel(m);
        if (m.attributes.isRedundantSupply === 'Y') {
          this.$(".note-marker-container").show();
        }
      }
      this.$('.has-popover').popover({
        trigger: 'hover'
      });
      this._setupDataTable();
      this._connectTableRowsToWugFeatures();
      if ((this.fetchCallback != null) && _.isFunction(this.fetchCallback)) {
        this.fetchCallback(strategyCollection.models);
      }
      this.trigger("table:endload");
      return true;
    };

    BaseStrategyCollectionView.prototype.fetchCallback = function(strategyModels) {
      var groupedById, newWugList;
      strategyModels = _.reject(strategyModels, function(m) {
        return m.get('recipientEntityType') === "WWP";
      });
      groupedById = _.groupBy(strategyModels, function(m) {
        return m.get("recipientEntityId");
      });
      newWugList = _.map(groupedById, function(group) {
        var entity;
        entity = _.reduce(group, function(memo, m) {
          memo.entityId = m.get("recipientEntityId");
          memo.name = m.get("recipientEntityName");
          memo.wktGeog = m.get("recipientEntityWktGeog");
          memo.type = m.get("recipientEntityType");
          memo.strategyTypes.push(m.get("typeId"));
          memo.totalSupply += m.get("supply" + namespace.currYear);
          return memo;
        }, {
          totalSupply: 0,
          strategyTypes: []
        });
        entity.strategyTypes = _.uniq(entity.strategyTypes);
        return entity;
      });
      newWugList.sort(function(a, b) {
        if (a.type === "WWP") {
          return -1;
        }
        if (b.type === "WWP") {
          return 1;
        }
        return b.totalSupply - a.totalSupply;
      });
      this.wugCollection.reset(newWugList);
      this.showWugFeatures();
    };

    BaseStrategyCollectionView.prototype._setupDataTable = function() {
      var $table, dtColConfig,
        _this = this;
      $table = this.$('table');
      dtColConfig = [];
      $('th', $table).each(function(i, th) {
        var $th;
        $th = $(th);
        if ($th.attr('data-sort') != null) {
          return dtColConfig.push({
            sType: $(th).attr('data-sort')
          });
        } else {
          return dtColConfig.push(null);
        }
      });
      $table.dataTable({
        bDestroy: true,
        sPaginationType: "bootstrap",
        aLengthMenu: [[10, 25, 50, 100, 99999], [10, 25, 50, 100, "All"]],
        aoColumns: dtColConfig,
        iDisplayLength: namespace.selectedDisplayLength || 10,
        fnDrawCallback: function(settings) {
          namespace.selectedDisplayLength = settings._iDisplayLength;
        }
      });
    };

    BaseStrategyCollectionView.prototype._connectTableRowsToWugFeatures = function() {
      var me;
      me = this;
      this.$('table tbody').delegate('td.strategyType', 'hover', function(event) {
        var typeId;
        if (event.type === 'mouseenter') {
          typeId = parseInt($(this).attr('data-type-id'));
          me.trigger("table:hovertype", typeId);
        } else {
          me.trigger("table:hovertype", null);
        }
      });
      this.$('table tbody').delegate('tr', 'hover', function(event) {
        var $target, wugId;
        if (event.type === 'mouseenter') {
          $target = $(this);
          wugId = parseInt($target.attr('data-entity-id'));
          me.trigger("table:hoverwug", wugId);
        } else {
          me.trigger("table:hoverwug", null);
        }
      });
    };

    BaseStrategyCollectionView.prototype.appendModel = function(model) {
      var modelView;
      modelView = new this.ModelView({
        model: model,
        currYear: namespace.currYear
      });
      this.$('tbody').append(modelView.render().el);
    };

    BaseStrategyCollectionView.prototype.showNothingFound = function() {
      $('#nothingFoundMessage').fadeIn();
      this.$el.hide();
    };

    BaseStrategyCollectionView.prototype.hideNothingFound = function() {
      $('#nothingFoundMessage').hide();
    };

    BaseStrategyCollectionView.prototype.showLoading = function() {
      this.$el.hide();
      this.hideNothingFound();
      $('.tableLoading').show();
    };

    BaseStrategyCollectionView.prototype.hideLoading = function() {
      $('.tableLoading').hide();
      this.$el.fadeIn();
    };

    BaseStrategyCollectionView.prototype.showWugFeatures = function() {
      var bounds, max_supply, min_supply, newFeature, wktFormat, wug, wugFeatures, _i, _len, _ref;
      if (this.wugLayer != null) {
        this.wugLayer.destroy();
      }
      if (this.wugCollection.models.length < 1) {
        return;
      }
      this.wugLayer = new OpenLayers.Layer.Vector("Water User Groups", {
        styleMap: this._wugStyleMap,
        displayInLayerSwitcher: false
      });
      wktFormat = new OpenLayers.Format.WKT();
      max_supply = this.wugCollection.max(function(m) {
        return m.get("totalSupply");
      }).get("totalSupply");
      min_supply = this.wugCollection.min(function(m) {
        return m.get("totalSupply");
      }).get("totalSupply");
      bounds = null;
      wugFeatures = [];
      _ref = this.wugCollection.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        wug = _ref[_i];
        newFeature = wktFormat.read(wug.get("wktGeog"));
        newFeature.attributes = _.clone(wug.attributes);
        newFeature.size = this._calculateScaledValue(max_supply, min_supply, this.MAX_WUG_RADIUS, this.MIN_WUG_RADIUS, wug.get("totalSupply"));
        delete newFeature.attributes.wktGeog;
        this.mapView.transformToWebMerc(newFeature.geometry);
        if (!(bounds != null)) {
          bounds = newFeature.geometry.getBounds().clone();
        } else {
          bounds.extend(newFeature.geometry.getBounds());
        }
        wugFeatures.push(newFeature);
      }
      this.wugLayer.addFeatures(wugFeatures);
      this.mapView.map.addLayer(this.wugLayer);
      this._setupWugHighlightContol();
      this._setupWugClickControl();
      this.mapView.zoomToExtent(bounds);
    };

    BaseStrategyCollectionView.prototype.selectWugFeature = function(wugId, projId) {
      var wugFeature, _i, _len, _ref;
      if (!(this.highlightFeatureControl != null)) {
        return;
      }
      _ref = this.wugLayer.features;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        wugFeature = _ref[_i];
        if (wugFeature.attributes.entityId === wugId) {
          this.highlightFeatureControl.select(wugFeature);
          return;
        }
      }
    };

    BaseStrategyCollectionView.prototype.unselectWugFeatures = function() {
      if (!(this.highlightFeatureControl != null) || !(this.highlightFeatureControl.layer != null) || !(this.highlightFeatureControl.layer.selectedFeatures != null)) {
        return;
      }
      this.highlightFeatureControl.unselectAll();
    };

    BaseStrategyCollectionView.prototype.highlightStratTypeWugs = function(stratTypeId) {
      var wugFeature, _i, _len, _ref;
      if (!this.wugLayer) {
        return;
      }
      _ref = this.wugLayer.features;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        wugFeature = _ref[_i];
        if ((wugFeature.attributes.strategyTypes != null) && _.contains(wugFeature.attributes.strategyTypes, stratTypeId)) {
          wugFeature.renderIntent = "typehighlight";
        } else {
          wugFeature.renderIntent = "transparent";
        }
      }
      this.wugLayer.redraw();
    };

    BaseStrategyCollectionView.prototype.unhighlightStratTypeWugs = function() {
      var wugFeature, _i, _len, _ref;
      if (!this.wugLayer) {
        return;
      }
      _ref = this.wugLayer.features;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        wugFeature = _ref[_i];
        wugFeature.renderIntent = "default";
      }
      this.wugLayer.redraw();
    };

    BaseStrategyCollectionView.prototype._setupWugClickControl = function() {
      if (!(this.clickFeatureControl != null)) {
        this._setupClickFeatureControl(this.wugLayer);
      } else {
        this._addLayerToControl(this.clickFeatureControl, this.wugLayer);
      }
    };

    BaseStrategyCollectionView.prototype._setupWugHighlightContol = function() {
      var _this = this;
      if (!(this.highlightFeatureControl != null)) {
        this._setupHighlightFeatureControl(this.wugLayer);
      } else {
        this._addLayerToControl(this.highlightFeatureControl, this.wugLayer);
      }
      this.highlightFeatureControl.events.register('featurehighlighted', null, function(event) {
        var popup, wugFeature;
        if (!(event.feature.layer != null) || event.feature.layer.id !== _this.wugLayer.id) {
          return;
        }
        wugFeature = event.feature;
        popup = new OpenLayers.Popup.FramedCloud("wugpopup", wugFeature.geometry.getBounds().getCenterLonLat(), null, "                        <b>" + wugFeature.attributes.name + "</b><br/>                        Total " + namespace.currYear + " Supply: " + ($.number(wugFeature.attributes.totalSupply)) + " ac-ft/yr                    ", null, false);
        popup.autoSize = true;
        wugFeature.popup = popup;
        _this.mapView.map.addPopup(popup);
      });
      this.highlightFeatureControl.events.register('featureunhighlighted', null, function(event) {
        var wugFeature;
        if (!(event.feature.layer != null) || event.feature.layer.id !== _this.wugLayer.id) {
          return;
        }
        wugFeature = event.feature;
        if (wugFeature.popup != null) {
          _this.mapView.map.removePopup(wugFeature.popup);
          wugFeature.popup.destroy();
          wugFeature.popup = null;
        }
      });
    };

    BaseStrategyCollectionView.prototype._addLayerToControl = function(control, newLayer) {
      if (!(control != null) || !(newLayer != null)) {
        return;
      }
      control.setLayer((control.layers || [control.layer]).concat(newLayer));
    };

    BaseStrategyCollectionView.prototype._setupClickFeatureControl = function(layer) {
      this.clickFeatureControl = new OpenLayers.Control.SelectFeature(layer, {
        autoActivate: true,
        clickFeature: this._clickFeature
      });
      this.clickFeatureControl.events.register("featurehighlighted", null, function(event) {
        this.events.triggerEvent("clickfeature", {
          feature: event.feature
        });
        return true;
      });
      this.mapView.map.addControl(this.clickFeatureControl);
    };

    BaseStrategyCollectionView.prototype._clickFeature = function(feature) {
      var wugId;
      if (feature.layer.id !== this.wugLayer.id) {
        return;
      }
      if ((feature.attributes.type != null) && feature.attributes.type === "WWP") {
        return;
      }
      wugId = feature.attributes.entityId;
      Backbone.history.navigate("#/" + namespace.currYear + "/wms/entity/" + wugId, {
        trigger: true
      });
    };

    BaseStrategyCollectionView.prototype._setupHighlightFeatureControl = function(layer) {
      this.highlightFeatureControl = new OpenLayers.Control.SelectFeature(layer, {
        multiple: false,
        hover: true,
        autoActivate: true,
        select: function(feature) {
          if (!(feature != null) || !(feature.layer != null)) {
            return;
          }
          OpenLayers.Control.SelectFeature.prototype.select.apply(this, arguments);
        },
        overFeature: function(feature) {
          var _this = this;
          layer = feature.layer;
          if (this.hover) {
            if (this.highlightOnly) {
              this.highlight(feature);
            } else if (OpenLayers.Util.indexOf(layer.selectedFeatures, feature) === -1) {
              this.highlightTimer = _.delay(function() {
                return _this.select(feature);
              }, 400);
            }
          }
        },
        outFeature: function(feature) {
          var control;
          if (this.hover) {
            if (this.highlightOnly) {
              if (feature._lastHighlighter === this.id) {
                if (feature._prevHighlighter && feature._prevHighlighter !== this.id) {
                  delete feature._lastHighlighter;
                  control = this.map.getControl(feature._prevHighlighter);
                  if (control) {
                    return control.highlight(feature);
                  }
                } else {
                  return this.unhighlight(feature);
                }
              }
            } else {
              clearTimeout(this.highlightTimer);
              return this.unselect(feature);
            }
          }
        }
      });
      this.mapView.map.addControl(this.highlightFeatureControl);
    };

    BaseStrategyCollectionView.prototype._calculateScaledValue = function(max, min, scale_max, scale_min, val) {
      var scaled_val;
      if (max === min) {
        return scale_min;
      }
      scaled_val = (scale_max - scale_min) * (val - min) / (max - min) + scale_min;
      return scaled_val;
    };

    BaseStrategyCollectionView.prototype._wugStyleMap = new OpenLayers.StyleMap({
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
      }),
      "typehighlight": new OpenLayers.Style({
        fillColor: "blue",
        fillOpacity: 0.8,
        strokeColor: "yellow"
      }),
      "transparent": new OpenLayers.Style({
        fillOpacity: 0,
        strokeOpacity: 0
      })
    });

    return BaseStrategyCollectionView;

  })(Backbone.View);
});
