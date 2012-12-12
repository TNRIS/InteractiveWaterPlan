// Generated by CoffeeScript 1.3.3

Ext.define('TNRIS.theme.ExistingSupplyTheme', {
  extend: 'TNRIS.theme.InteractiveTheme',
  WUGLayer: null,
  selectedYear: null,
  selectWUGControl: null,
  supplyPanel: null,
  showFeatureResult: function(features, clickedPoint, year) {
    var popupText, prop;
    popupText = "";
    for (prop in features) {
      popupText += "" + prop + ": " + features[prop] + "<br/>";
    }
    map.addPopup(new OpenLayers.Popup.FramedCloud("Feature Info", map.getLonLatFromPixel(clickedPoint), null, popupText, null, true));
    return null;
  },
  loadTheme: function() {
    var _this = this;
    this.supplyPanel = Ext.create('ISWP.view.theme.ExistingSupplyPanel', {
      wugStore: this.entityStore
    });
    this.mainContainer.add(this.supplyPanel);
    this.supplyPanel.initialize();
    this.supplyPanel.on('zoomtoclick', function(grid, rowIndex) {
      var bounds, rec, wug_feat, _i, _len, _ref;
      rec = grid.getStore().getAt(rowIndex);
      _ref = _this.WUGLayer.features;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        wug_feat = _ref[_i];
        if (rec.data.Id === wug_feat.data.Id) {
          bounds = wug_feat.geometry.getBounds();
          _this.mapComp.map.zoomToExtent(bounds);
          _this.selectWUGControl.unselectAll();
          _this.selectWUGControl.select(wug_feat);
          break;
        }
      }
      return null;
    });
    this.supplyPanel.on('regionselect', function(place) {
      console.log('region selected', place);
      return null;
    });
    this.supplyPanel.on('regionclear', function() {
      console.log('region cleared');
      return null;
    });
    this.supplyPanel.on('countyselect', function(place) {
      console.log('county selected', place);
      return null;
    });
    this.supplyPanel.on('countyclear', function() {
      console.log('county cleared');
      return null;
    });
    /*
            TODO: Don't load entities on load. Only after a region or county is selected
            this.entityStore.load({
                scope: this
                callback: (records, operation, success) ->
                    unless success then return false
                    this._displaySupplyEntities(records)
    
                    
                    return null        
            })
    */

    return null;
  },
  unloadTheme: function() {
    this.mapComp.removePopupsFromMap();
    this._removeSelectWUGControl();
    if (this.WUGLayer != null) {
      this.WUGLayer.destroy();
    }
    this.mainContainer.removeAll(true);
    return null;
  },
  _removeSelectWUGControl: function() {
    if (this.selectWUGControl != null) {
      this.mapComp.map.removeControl(this.selectWUGControl);
      this.selectWUGControl.destroy();
    }
    return null;
  },
  _displaySupplyEntities: function(records) {
    var bounds, data, entity_features, map, new_feat, rec, select, wktFormat, _i, _len;
    map = this.mapComp.map;
    this.WUGLayer = new OpenLayers.Layer.Vector("Water Users", {
      styleMap: this._wugStyleMap
    });
    wktFormat = new OpenLayers.Format.WKT();
    bounds = null;
    entity_features = [];
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      rec = records[_i];
      data = rec.data;
      new_feat = wktFormat.read(rec.data.WktGeog);
      new_feat.data = data;
      new_feat.geometry = new_feat.geometry.transform(map.displayProjection, map.projection);
      new_feat.attributes['label'] = data['Name'];
      if (!(bounds != null)) {
        bounds = new_feat.geometry.getBounds();
      } else {
        bounds.extend(new_feat.geometry.getBounds());
      }
      entity_features.push(new_feat);
    }
    this.WUGLayer.addFeatures(entity_features);
    map.addLayer(this.WUGLayer);
    select = new OpenLayers.Control.SelectFeature(this.WUGLayer, {
      hover: false,
      onSelect: function(feature) {
        var popup;
        popup = new OpenLayers.Popup.FramedCloud("featurepopup", feature.geometry.getBounds().getCenterLonLat(), null, "<h3>" + feature.data.Name + "</h3>\nPlanning Region: " + feature.data.RegionName + "<br/>\nCounty: " + feature.data.County + "<br/>\nBasin: " + feature.data.Basin + "<br/>", null, true, function() {
          select.unselect(feature);
          return null;
        });
        feature.popup = popup;
        return map.addPopup(popup);
      },
      onUnselect: function(feature) {
        map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
        return null;
      }
    });
    this.selectWUGControl = select;
    map.addControl(select);
    select.activate();
    return null;
  },
  _wugStyleMap: new OpenLayers.StyleMap({
    "default": new OpenLayers.Style({
      pointRadius: 5,
      strokeColor: 'aqua',
      strokeWidth: 0.5,
      fillColor: 'blue',
      fillOpacity: 0.8
    }, {
      rules: [
        new OpenLayers.Rule({
          symbolizer: {
            pointRadius: 4
          }
        }), new OpenLayers.Rule({
          maxScaleDenominator: 866688,
          symbolizer: {
            fontSize: "10px",
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
      fillColor: 'yellow',
      strokeColor: 'blue',
      fillOpacity: 1
    })
  })
});
