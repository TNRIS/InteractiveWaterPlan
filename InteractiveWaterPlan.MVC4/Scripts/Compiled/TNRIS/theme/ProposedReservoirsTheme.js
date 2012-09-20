// Generated by CoffeeScript 1.3.3

Ext.define('TNRIS.theme.ProposedReservoirsTheme', {
  extend: 'TNRIS.theme.InteractiveTheme',
  max_radius: 12,
  min_radius: 4,
  themeName: null,
  curr_reservoir: null,
  reservoirStore: null,
  reservoirLayer: null,
  serviceUrl: 'api/feature/reservoir/proposed',
  layerName: 'Planned Reservoir User Entities',
  styleMap: new OpenLayers.Style({
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
        switch (feature.attributes['type']) {
          case 'reservoir':
            return 5;
          case 'entity':
            return feature.size;
        }
        return 0;
      }
    }
  }),
  loadTheme: function() {
    var map;
    map = this.mapComp.map;
    this.mapComp.removePopupsFromMap();
    this.mapComp.clearVectorLayer();
    this.mapComp.removeFeatureControl();
    this.contentPanel.update("<h3>Proposed Reservoirs</h3>\n<p>Click on a reservoir to see the water user groups that will benefit from its supply.</p>");
    this.reservoirStore.load({
      scope: this,
      callback: function(records, operation, success) {
        var data, new_feat, rec, res_features, wktFormat, _i, _len;
        if (!success) {
          return false;
        }
        this.reservoirLayer = new OpenLayers.Layer.Vector("Recommended Reservoirs", {
          styleMap: new OpenLayers.Style({
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
          })
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
          new_feat.attributes['label'] = data['Name'];
          res_features.push(new_feat);
        }
        this.reservoirLayer.addFeatures(res_features);
        map.addLayer(this.reservoirLayer);
        this.mapComp.setupFeatureControl(this.reservoirLayer, this.serviceUrl);
        return null;
      }
    });
    /*
            this.themeStore.load({
                params:
                    ThemeName: this.themeName
                scope: this #scope the callback to this controller
                callback: (records, operation, success) ->
                    new_layers = []
    
                    unless success and records.length == 1
                        return false
    
                    themeData = records[0].data
    
                    for layer in themeData.Layers
                        if layer.ServiceType == "WMS"
                            new_lyr = new OpenLayers.Layer.WMS(
                                layer.Name,
                                layer.Url,
                                {
                                    layers: layer.WMSLayerNames
                                    transparent: true
                                }
                            )
                            new_layers.push(new_lyr)
                             
                    this.mapComp.addLayersToMap(new_layers)
                    this.mapComp.setupFeatureControl(new_layers, themeData.ServiceUrl)
                    return null
            })
    */

    return null;
  },
  unloadTheme: function() {
    if (this.reservoirLayer != null) {
      this.reservoirLayer.destroy();
    }
    return null;
  },
  updateYear: function(year) {
    if (this.curr_reservoir != null) {
      this._showReservoirAndRelatedEntities(year);
    }
    return null;
  },
  showFeatureResult: function(features, clickedPoint, year) {
    this.curr_reservoir = features[0];
    this._showReservoirAndRelatedEntities(year);
    return null;
  },
  _showReservoirAndRelatedEntities: function(year) {
    var map, res_feat, wktFormat;
    map = this.mapComp.map;
    this.mapComp.removePopupsFromMap();
    this.mapComp.clearVectorLayer();
    this.mapComp.vectorLayer = new OpenLayers.Layer.Vector(this.layerName, {
      styleMap: this.styleMap
    });
    wktFormat = new OpenLayers.Format.WKT();
    res_feat = wktFormat.read(this.curr_reservoir.WKTGeog);
    res_feat.geometry.transform(map.displayProjection, map.projection);
    res_feat.data = this.curr_reservoir;
    res_feat.attributes['type'] = 'reservoir';
    this.mapComp.vectorLayer.addFeatures(res_feat);
    map.addLayer(this.mapComp.vectorLayer);
    this.contentPanel.update("<h3>" + this.curr_reservoir.Name + ": " + year + "</h3>");
    this.dataStore.load({
      params: {
        Year: year,
        forReservoirId: this.curr_reservoir['Id']
      },
      scope: this,
      callback: function(records, operation, success) {
        var bounds, connector_lines, data, line, max_supply, min_supply, new_feat, rec, related_entity_features, res_feat_centroid, select, _i, _j, _len, _len1;
        if (!(records != null) || records.length === 0) {
          return null;
        }
        bounds = null;
        related_entity_features = [];
        connector_lines = [];
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
        for (_j = 0, _len1 = records.length; _j < _len1; _j++) {
          rec = records[_j];
          data = rec.data;
          new_feat = wktFormat.read(rec.data.WKTGeog);
          new_feat.data = data;
          new_feat.attributes['type'] = 'entity';
          new_feat.geometry = new_feat.geometry.transform(map.displayProjection, map.projection);
          new_feat.size = this._calculateScaledValue(max_supply, min_supply, this.max_radius, this.min_radius, new_feat.data.SourceSupply);
          res_feat_centroid = res_feat.geometry.getCentroid();
          line = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([new OpenLayers.Geometry.Point(res_feat_centroid.x, res_feat_centroid.y), new OpenLayers.Geometry.Point(new_feat.geometry.x, new_feat.geometry.y)]));
          line.attributes['type'] = 'line';
          connector_lines.push(line);
          if (!(bounds != null)) {
            bounds = new_feat.geometry.getBounds();
          } else {
            bounds.extend(new_feat.geometry.getBounds());
          }
          related_entity_features.push(new_feat);
        }
        this.mapComp.vectorLayer.addFeatures(connector_lines);
        this.mapComp.vectorLayer.addFeatures(related_entity_features);
        select = new OpenLayers.Control.SelectFeature(this.mapComp.vectorLayer, {
          hover: false,
          onSelect: function(feature) {
            var point, popup, _ref;
            if (!feature.data.Name) {
              return false;
            }
            point = {};
            _ref = [feature.geometry.getCentroid().x, feature.geometry.getCentroid().y], point.lon = _ref[0], point.lat = _ref[1];
            popup = new OpenLayers.Popup.FramedCloud("featurepopup", point, null, "<h3>" + feature.data.Name + "</h3>\nSource Supply: " + feature.data.SourceSupply + " ac-ft/yr<br/>", null, true, function() {
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
        map.addControl(select);
        this.mapComp.selectFeatureControlId = select.id;
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
  }
});
