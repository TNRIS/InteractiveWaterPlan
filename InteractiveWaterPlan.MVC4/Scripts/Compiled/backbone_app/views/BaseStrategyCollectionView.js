// Generated by CoffeeScript 1.3.3
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
      _.bindAll(this, 'render', 'unrender', 'fetchCollection', 'appendModel', 'hideLoading', 'showLoading', 'onFetchCollectionSuccess', 'fetchCallback', '_setupDataTable', '_connectTableRowsToWugFeatures', 'showNothingFound', 'hideNothingFound', 'showWugFeatures', 'clearWugFeaturesAndControls', '_setupWugClickControl', 'selectWugFeature', 'unselectWugFeatures', '_setupWugHighlightControl', 'highlightStratTypeWugs', 'unhighlightStratTypeWugs');
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
      this.fetchCollection();
      ko.applyBindings(this, this.el);
      this.$('.has-popover').popover({
        trigger: 'hover',
        placement: 'top'
      });
      return this;
    };

    BaseStrategyCollectionView.prototype.unrender = function() {
      this.clearWugFeaturesAndControls();
      this.$el.html();
      return null;
    };

    BaseStrategyCollectionView.prototype.fetchCollection = function() {
      var params,
        _this = this;
      this.$('tbody').empty();
      params = _.extend({
        year: namespace.currYear
      }, this.fetchParams);
      this.trigger("table:startload");
      this.strategyCollection.fetch({
        data: params,
        success: this.onFetchCollectionSuccess,
        error: function() {
          _this.trigger("table:fetcherror");
        }
      });
    };

    BaseStrategyCollectionView.prototype.onFetchCollectionSuccess = function(strategyCollection) {
      var m, _i, _len, _ref;
      if (strategyCollection.models.length === 0) {
        this.trigger("table:nothingfound");
        return false;
      }
      _ref = strategyCollection.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        m = _ref[_i];
        this.appendModel(m);
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
    };

    BaseStrategyCollectionView.prototype.fetchCallback = function(strategyModels) {
      var groupedById, newWugList;
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

    BaseStrategyCollectionView.prototype._mapStrategyModelToWugFeature = function(m) {
      return {
        entityId: m.get("recipientEntityId"),
        name: m.get("recipientEntityName"),
        wktGeog: m.get("recipientEntityWktGeog"),
        totalSupply: m.get("supply" + namespace.currYear),
        type: m.get("recipientEntityType"),
        stratTypeId: m.get("typeId")
      };
    };

    BaseStrategyCollectionView.prototype._setupDataTable = function() {
      var $table, dtColConfig;
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
        aoColumns: dtColConfig
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
      this.clearWugFeaturesAndControls();
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
        newFeature.geometry = this.mapView.transformToWebMerc(newFeature.geometry);
        if (!(bounds != null)) {
          bounds = newFeature.geometry.getBounds().clone();
        } else {
          bounds.extend(newFeature.geometry.getBounds());
        }
        wugFeatures.push(newFeature);
      }
      this.wugLayer.addFeatures(wugFeatures);
      this.mapView.map.addLayer(this.wugLayer);
      this.wugHighlightControl = this._setupWugHighlightControl();
      this.mapView.map.addControl(this.wugHighlightControl);
      this.wugClickControl = this._setupWugClickControl();
      this.mapView.map.addControl(this.wugClickControl);
      this.mapView.zoomToExtent(bounds);
    };

    BaseStrategyCollectionView.prototype.clearWugFeaturesAndControls = function() {
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

    BaseStrategyCollectionView.prototype.selectWugFeature = function(wugId, projId) {
      var wugFeature, _i, _len, _ref;
      if (!(this.wugHighlightControl != null)) {
        return;
      }
      _ref = this.wugLayer.features;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        wugFeature = _ref[_i];
        if (wugFeature.attributes.entityId === wugId) {
          this.wugHighlightControl.select(wugFeature);
          return;
        }
      }
    };

    BaseStrategyCollectionView.prototype.unselectWugFeatures = function() {
      if (!(this.wugHighlightControl != null) || !(this.wugHighlightControl.layer.selectedFeatures != null)) {
        return;
      }
      this.wugHighlightControl.unselectAll();
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
      var control,
        _this = this;
      control = new OpenLayers.Control.SelectFeature(this.wugLayer, {
        autoActivate: true,
        clickFeature: function(wugFeature) {
          var wugId;
          if ((wugFeature.attributes.type != null) && wugFeature.attributes.type === "WWP") {
            return;
          }
          wugId = wugFeature.attributes.entityId;
          Backbone.history.navigate("#/" + namespace.currYear + "/wms/entity/" + wugId, {
            trigger: true
          });
        }
      });
      return control;
    };

    BaseStrategyCollectionView.prototype._setupWugHighlightControl = function() {
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
          popup = new OpenLayers.Popup.FramedCloud("wugpopup", wugFeature.geometry.getBounds().getCenterLonLat(), null, "                                <b>" + wugFeature.attributes.name + "</b><br/>                                Total " + namespace.currYear + " Supply: " + ($.number(wugFeature.attributes.totalSupply)) + " ac-ft/yr                            ", null, false);
          popup.autoSize = true;
          wugFeature.popup = popup;
          _this.mapView.map.addPopup(popup);
        },
        onUnselect: function(wugFeature) {
          clearTimeout(timer);
          if (wugFeature.popup != null) {
            _this.mapView.map.removePopup(wugFeature.popup);
            wugFeature.popup.destroy();
            wugFeature.popup = null;
          }
        }
      });
      return control;
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
