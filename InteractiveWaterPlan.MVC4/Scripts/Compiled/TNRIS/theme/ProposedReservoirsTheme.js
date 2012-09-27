// Generated by CoffeeScript 1.3.3

Ext.define('TNRIS.theme.ProposedReservoirsTheme', {
  extend: 'TNRIS.theme.InteractiveTheme',
  max_radius: 12,
  min_radius: 4,
  curr_reservoir: null,
  reservoirStore: null,
  reservoirLayer: null,
  relatedWUGLayer: null,
  supplyStore: null,
  featureControl: null,
  selectReservoirControl: null,
  loadTheme: function() {
    var map;
    map = this.mapComp.map;
    this.reservoirStore.load({
      scope: this,
      callback: function(records, operation, success) {
        var data, new_feat, rec, res_features, wktFormat, _i, _len;
        if (!success) {
          return false;
        }
        this.reservoirLayer = new OpenLayers.Layer.Vector("Recommended Reservoirs", {
          styleMap: this._reservoirStyleMap
        });
        wktFormat = new OpenLayers.Format.WKT();
        res_features = [];
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          rec = records[_i];
          data = rec.data;
          new_feat = wktFormat.read(data.WKTGeog);
          if (new_feat.geometry == null) {
            continue;
          }
          this.mapComp.transformToWebMerc(new_feat.geometry);
          delete data.WKTGeog;
          new_feat.data = data;
          new_feat.attributes['label'] = data['Name'];
          res_features.push(new_feat);
        }
        this.reservoirLayer.addFeatures(res_features);
        map.addLayer(this.reservoirLayer);
        this._changeToReservoirsLayout();
        this._setupSelectReservoirControl();
        return null;
      }
    });
    return null;
  },
  unloadTheme: function() {
    this.mapComp.removePopupsFromMap();
    this._removeSelectWUGControl();
    this._removeSelectReservoirControl();
    if (this.reservoirLayer != null) {
      this.reservoirLayer.destroy();
    }
    if (this.relatedWUGLayer != null) {
      this.relatedWUGLayer.destroy();
    }
    this.mainPanel.removeAll(true);
    return null;
  },
  updateYear: function(year) {
    this.selectedYear = year;
    this._clearRelatedEntities();
    if (this.curr_reservoir != null) {
      this._showRelatedEntities();
      this.supplyStore.load({
        params: {
          ReservoirId: this.curr_reservoir.data.Id,
          Year: this.selectedYear
        }
      });
    }
    return null;
  },
  _removeSelectReservoirControl: function() {
    if (this.selectReservoirControl != null) {
      this.mapComp.map.removeControl(this.selectReservoirControl);
      this.selectReservoirControl.destroy();
    }
    return null;
  },
  _removeSelectWUGControl: function() {
    if (this.selectWUGControl != null) {
      this.mapComp.map.removeControl(this.selectWUGControl);
      this.selectWUGControl.destroy();
    }
    return null;
  },
  _setupSelectReservoirControl: function() {
    var _this = this;
    this._removeSelectReservoirControl();
    this.selectReservoirControl = new OpenLayers.Control.SelectFeature(this.reservoirLayer, {
      hover: false,
      onSelect: function(feature) {
        _this.curr_reservoir = feature;
        _this._changeToRelatedEntitiesLayout();
        _this._showRelatedEntities();
        _this._updateSupplyChart();
        return null;
      },
      onUnselect: function(feature) {
        _this._clearRelatedEntities();
        _this._changeToReservoirsLayout();
        _this.curr_reservoir = null;
        return null;
      }
    });
    this.mapComp.map.addControl(this.selectReservoirControl);
    this.selectReservoirControl.activate();
    return null;
  },
  _changeToReservoirsLayout: function() {
    var headerPanel, reservoirGridPanel,
      _this = this;
    this.mainPanel.removeAll(true);
    headerPanel = Ext.create('Ext.panel.Panel', {
      region: 'north',
      height: 60,
      html: "<h3>Recommended Reservoirs</h3>\n<p>Select a reservoir by clicking on one in the map or double-clicking a name below to see the water user groups that will benefit from its supply.</p>"
    });
    this.mainPanel.add(headerPanel);
    reservoirGridPanel = Ext.create('Ext.grid.Panel', {
      store: this.reservoirStore,
      columns: [
        {
          text: "Name",
          width: 120,
          dataIndex: 'Name',
          sortable: true,
          hideable: false,
          draggable: false,
          resizable: false
        }, {
          xtype: 'actioncolumn',
          width: 6,
          resizable: false,
          sortable: false,
          hideable: false,
          draggable: false,
          items: [
            {
              iconCls: 'icon-zoom-in',
              tooltip: 'Zoom To',
              handler: function(grid, rowIndex, colIndex) {
                var bounds, rec, res_feat, _i, _len, _ref;
                rec = grid.getStore().getAt(rowIndex);
                _ref = _this.reservoirLayer.features;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  res_feat = _ref[_i];
                  if (rec.data.Id === res_feat.data.Id) {
                    bounds = res_feat.geometry.getBounds();
                    _this.mapComp.map.zoomToExtent(bounds);
                    break;
                  }
                }
                return null;
              }
            }
          ]
        }
      ],
      forceFit: true,
      autoScroll: true,
      region: 'center'
    });
    reservoirGridPanel.on('itemdblclick', function(grid, record) {
      var res_feat, _i, _len, _ref;
      _this.selectReservoirControl.unselectAll();
      _ref = _this.reservoirLayer.features;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        res_feat = _ref[_i];
        if (record.data.Id === res_feat.data.Id) {
          _this.curr_reservoir = res_feat;
          break;
        }
      }
      _this.selectReservoirControl.select(_this.curr_reservoir);
      return null;
    });
    this.mainPanel.add(reservoirGridPanel);
    return null;
  },
  _changeToRelatedEntitiesLayout: function() {
    var chart, headerPanel, relatedEntitiesGridPanel,
      _this = this;
    this.mainPanel.removeAll(true);
    headerPanel = Ext.create('Ext.panel.Panel', {
      region: 'north',
      height: 60,
      html: "<h3>" + this.curr_reservoir.data.Name + "</h3>\n<p>Descriptive text. Clear Selection button. Animate button.</p>"
    });
    this.mainPanel.add(headerPanel);
    relatedEntitiesGridPanel = Ext.create('Ext.grid.Panel', {
      store: this.relatedWUGStore,
      columns: [
        {
          text: "Name",
          width: 120,
          dataIndex: "Name",
          hideable: false,
          draggable: false,
          resizable: false
        }, {
          text: "Supply (acre-feet)",
          width: 60,
          dataIndex: "SourceSupply",
          hideable: false,
          draggable: false,
          resizable: false
        }, {
          text: "Planning Area",
          width: 50,
          dataIndex: "RWP",
          hideable: false,
          draggable: false,
          resizable: false
        }, {
          text: "County",
          width: 60,
          dataIndex: "County",
          hideable: false,
          draggable: false,
          resizable: false
        }, {
          text: "Basin",
          width: 50,
          dataIndex: "Basin",
          hideable: false,
          draggable: false,
          resizable: false
        }, {
          xtype: 'actioncolumn',
          width: 10,
          resizable: false,
          sortable: false,
          hideable: false,
          draggable: false,
          items: [
            {
              iconCls: 'icon-zoom-in',
              tooltip: 'Zoom To',
              handler: function(grid, rowIndex, colIndex) {
                var bounds, rec, wug_feat, _i, _len, _ref;
                rec = grid.getStore().getAt(rowIndex);
                _ref = _this.relatedWUGLayer.features;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  wug_feat = _ref[_i];
                  if (rec.data.Id === wug_feat.data.Id) {
                    bounds = wug_feat.geometry.getBounds();
                    _this.mapComp.map.zoomToExtent(bounds);
                    break;
                  }
                }
                return null;
              }
            }
          ]
        }
      ],
      emptyText: "There are no related water user groups for the chosen reservoir and decade. Try selecting a different planning decade.",
      forceFit: true,
      autoScroll: true,
      region: 'center'
    });
    relatedEntitiesGridPanel.on('itemdblclick', function(grid, record) {
      var wug_feat, _i, _len, _ref;
      _this.selectWUGControl.unselectAll();
      _ref = _this.relatedWUGLayer.features;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        wug_feat = _ref[_i];
        if (record.data.Id === wug_feat.data.Id) {
          _this.selectWUGControl.select(wug_feat);
          break;
        }
      }
      return null;
    });
    this.mainPanel.add(relatedEntitiesGridPanel);
    chart = Ext.create('ISWP.view.chart.WaterUseChart', {
      store: this.supplyStore,
      region: 'west',
      width: 260,
      animate: false,
      shadow: false
    });
    this.mainPanel.add(chart);
    return null;
  },
  _updateSupplyChart: function() {
    this.supplyStore.load({
      params: {
        ReservoirId: this.curr_reservoir.data.Id,
        Year: this.selectedYear
      }
    });
    return null;
  },
  _clearRelatedEntities: function() {
    this.mapComp.removePopupsFromMap();
    this._removeSelectWUGControl();
    if (this.relatedWUGLayer != null) {
      this.relatedWUGLayer.destroy();
    }
    return null;
  },
  _showRelatedEntities: function() {
    var map;
    map = this.mapComp.map;
    this.relatedWUGLayer = new OpenLayers.Layer.Vector('Related WUGs', {
      styleMap: this._wugStyleMap
    });
    map.addLayer(this.relatedWUGLayer);
    this.relatedWUGStore.load({
      params: {
        Year: this.selectedYear,
        forReservoirId: this.curr_reservoir.data.Id
      },
      scope: this,
      callback: function(records, operation, success) {
        var connector_lines, data, line, max_supply, min_supply, new_feat, rec, related_entity_features, res_feat_centroid, select, wktFormat, _i, _j, _len, _len1;
        if (!(records != null) || records.length === 0) {
          return null;
        }
        related_entity_features = [];
        connector_lines = [];
        wktFormat = new OpenLayers.Format.WKT();
        max_supply = null;
        min_supply = null;
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          rec = records[_i];
          if (!(max_supply != null) || max_supply < rec.data.SourceSupply) {
            max_supply = rec.data.SourceSupply;
          }
          if (!(min_supply != null) || min_supply > rec.data.SourceSupply) {
            min_supply = rec.data.SourceSupply;
          }
        }
        res_feat_centroid = this.curr_reservoir.geometry.getCentroid(true);
        for (_j = 0, _len1 = records.length; _j < _len1; _j++) {
          rec = records[_j];
          data = rec.data;
          new_feat = wktFormat.read(rec.data.WKTGeog);
          new_feat.data = data;
          new_feat.attributes['type'] = 'entity';
          new_feat.geometry = new_feat.geometry.transform(map.displayProjection, map.projection);
          new_feat.size = this._calculateScaledValue(max_supply, min_supply, this.max_radius, this.min_radius, new_feat.data.SourceSupply);
          line = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([new OpenLayers.Geometry.Point(res_feat_centroid.x, res_feat_centroid.y), new OpenLayers.Geometry.Point(new_feat.geometry.x, new_feat.geometry.y)]));
          line.attributes['type'] = 'line';
          connector_lines.push(line);
          related_entity_features.push(new_feat);
        }
        this.relatedWUGLayer.addFeatures(connector_lines);
        this.relatedWUGLayer.addFeatures(related_entity_features);
        select = new OpenLayers.Control.SelectFeature(this.relatedWUGLayer, {
          onSelect: function(feature) {
            var point, popup, _ref;
            if (!feature.data.Name) {
              return false;
            }
            point = {};
            _ref = [feature.geometry.getCentroid().x, feature.geometry.getCentroid().y], point.lon = _ref[0], point.lat = _ref[1];
            popup = new OpenLayers.Popup.FramedCloud("featurepopup", point, null, "<h3>" + feature.data.Name + "</h3>\nSupply: " + feature.data.SourceSupply + " acre-ft<br/>", null, true, function() {
              select.unselect(feature);
              return null;
            });
            feature.popup = popup;
            map.addPopup(popup);
            return null;
          },
          onUnselect: function(feature) {
            if (feature.popup) {
              map.removePopup(feature.popup);
              feature.popup.destroy();
              feature.popup = null;
            }
            return null;
          }
        });
        this.selectWUGControl = select;
        map.addControl(select);
        select.activate();
        return null;
      }
    });
    return null;
  },
  _calculateScaledValue: function(max, min, scale_max, scale_min, val) {
    var scaled_val;
    if (max === min) {
      return scale_min;
    }
    scaled_val = (scale_max - scale_min) * (val - min) / (max - min) + scale_min;
    return scaled_val;
  },
  _reservoirStyleMap: new OpenLayers.StyleMap({
    "default": new OpenLayers.Style({
      pointRadius: 4,
      strokeColor: 'blue',
      strokeWidth: 0.5,
      fillColor: 'cyan',
      fillOpacity: 0.8
    }, {
      rules: [
        new OpenLayers.Rule({
          symbolizer: {
            pointRadius: 4
          }
        }), new OpenLayers.Rule({
          maxScaleDenominator: 1866688,
          symbolizer: {
            fontSize: "12px",
            labelAlign: 'cb',
            labelOutlineColor: "white",
            labelOutlineWidth: 2,
            labelYOffset: 6,
            label: "${label}"
          }
        })
      ]
    }),
    "select": new OpenLayers.Style({
      pointRadius: 5,
      strokeColor: 'blue',
      strokeWidth: 2
    })
  }),
  _wugStyleMap: new OpenLayers.StyleMap({
    "default": new OpenLayers.Style({
      pointRadius: '${getPointRadius}',
      strokeColor: '${getStrokeColor}',
      strokeWidth: '${getStrokeWidth}',
      fillColor: '${getColor}',
      fillOpacity: 0.8
    }, {
      context: {
        getColor: function(feature) {
          switch (feature.attributes['type']) {
            case 'reservoir':
              return 'transparent';
            case 'entity':
              return 'green';
            case 'line':
              return 'grey';
          }
          return 'red';
        },
        getStrokeWidth: function(feature) {
          if (feature.attributes['type'] === 'reservoir') {
            return 2;
          }
          return 0.5;
        },
        getStrokeColor: function(feature) {
          switch (feature.attributes['type']) {
            case 'reservoir':
              return 'blue';
            case 'entity':
              return 'lime';
            case 'line':
              return 'lightgrey';
          }
          return 'red';
        },
        getPointRadius: function(feature) {
          if ((feature.attributes.type != null) && feature.attributes.type === 'entity') {
            return feature.size;
          }
          return 0;
        }
      }
    }),
    "select": new OpenLayers.Style({
      fillColor: "yellow"
    })
  })
});
