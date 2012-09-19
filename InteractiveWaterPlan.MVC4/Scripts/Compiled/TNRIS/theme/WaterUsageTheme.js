// Generated by CoffeeScript 1.3.3

Ext.define('TNRIS.theme.WaterUsageTheme', {
  extend: 'TNRIS.theme.InteractiveTheme',
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
    var map;
    map = this.mapComp.map;
    this.mapComp.removePopupsFromMap();
    this.mapComp.clearVectorLayer();
    this.mapComp.removeFeatureControl();
    this.contentPanel.update("<h3>Water Use</h3>\n<p>Click on a dot to view the information for that water user group.</p>");
    this.dataStore.load({
      scope: this,
      callback: function(records, operation, success) {
        var bounds, data, entity_features, new_feat, rec, select, wktFormat, _i, _len;
        this.mapComp.vectorLayer = new OpenLayers.Layer.Vector("Water Users", {
          styleMap: new OpenLayers.Style({
            pointRadius: 4,
            strokeColor: 'cyan',
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
                  labelAlign: 'lb',
                  labelOutlineColor: "white",
                  labelOutlineWidth: 2,
                  labelXOffset: 3,
                  labelYOffset: 5,
                  label: "${label}"
                }
              })
            ]
          })
        });
        wktFormat = new OpenLayers.Format.WKT();
        bounds = null;
        entity_features = [];
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          rec = records[_i];
          data = rec.data;
          new_feat = wktFormat.read(rec.data.WKTGeog);
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
        this.mapComp.vectorLayer.addFeatures(entity_features);
        map.addLayer(this.mapComp.vectorLayer);
        select = new OpenLayers.Control.SelectFeature(this.mapComp.vectorLayer, {
          hover: false,
          onSelect: function(feature) {
            var popup;
            popup = new OpenLayers.Popup.FramedCloud("featurepopup", feature.geometry.getBounds().getCenterLonLat(), null, "<h3>" + feature.data.Name + "</h3>\nPlanning Region: " + feature.data.RWP + "<br/>\nCounty: " + feature.data.County + "<br/>\nBasin: " + feature.data.Basin + "<br/>", null, true, function() {
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
        map.addControl(select);
        this.mapComp.selectFeatureControlId = select.id;
        select.activate();
        return null;
      }
    });
    return null;
  }
});
