// Generated by CoffeeScript 1.3.3

Ext.define('ISWP.controller.Main', {
  extend: 'Ext.app.Controller',
  views: ['chart.WaterUseChart', 'data.MainPanel', 'map.MapComponent', 'map.ThemeYearMapPanel'],
  stores: ['WaterUseData', 'Theme', 'WaterUseEntity', 'Entity', 'Place', 'PlaceFeature', 'ReservoirFeature', 'ReservoirSupplyData'],
  refs: [
    {
      ref: 'mainPanel',
      selector: 'mainpanel'
    }, {
      ref: 'themeYearMapPanel',
      selector: 'themeyearmappanel'
    }, {
      ref: 'mainPanel',
      selector: '#mainPanel'
    }, {
      ref: 'mapComponent',
      selector: 'mapcomponent'
    }, {
      ref: 'placeCombo',
      selector: '#placeCombo'
    }
  ],
  selectFeatureControlId: null,
  selectedYear: null,
  selectedTheme: null,
  interactiveTheme: null,
  init: function() {
    return this.control({
      'mapcomponent': {
        boxready: function(mapComp) {
          mapComp.initializeMap();
          this.selectedTheme = this.getThemeYearMapPanel().getSelectedTheme();
          this.selectedYear = this.getThemeYearMapPanel().getSelectedYear();
          this.loadThemeIntoMap(this.selectedTheme);
          return null;
        }
      },
      'button[toggleGroup=yearButtons]': {
        click: function(btn, evt) {
          this.selectedYear = btn.year;
          this.interactiveTheme.updateYear(btn.year);
          return null;
        }
      },
      'button[toggleGroup=themeButtons]': {
        click: function(btn, evt) {
          this.selectedTheme = btn.theme;
          this.loadThemeIntoMap(btn.theme);
          return null;
        }
      },
      '#resetExtentButton': {
        click: function(btn, evt) {
          this.getMapComponent().resetExtent();
          return null;
        }
      },
      '#clearPlaceButton': {
        click: function(btn, evt) {
          this.getPlaceCombo().clearValue();
          this.getMapComponent().clearPlaceFeature();
          return null;
        }
      },
      '#placeCombo': {
        select: function(combo, records) {
          var selectedPlace;
          if (records.length !== 1) {
            return null;
          }
          selectedPlace = records[0].data;
          this.getPlaceFeatureStore().load({
            params: {
              placeId: selectedPlace.SqlId
            },
            scope: this,
            callback: function(records, operation, success) {
              var bounds, mapComp, placeFeature, wktFormat;
              if (!(success && records.length === 1)) {
                return null;
              }
              mapComp = this.getMapComponent();
              wktFormat = new OpenLayers.Format.WKT();
              placeFeature = wktFormat.read(records[0].data.WKTGeog);
              mapComp.transformToWebMerc(placeFeature.geometry);
              bounds = placeFeature.geometry.getBounds();
              mapComp.zoomToExtent(bounds);
              mapComp.setPlaceFeature(selectedPlace.Name, placeFeature);
              return null;
            }
          });
          return null;
        }
      }
    });
  },
  loadThemeIntoMap: function(themeName) {
    if (this.interactiveTheme != null) {
      this.interactiveTheme.unload();
    }
    if (themeName === 'water-use') {
      this.interactiveTheme = new TNRIS.theme.WaterUsageTheme({
        mapComp: this.getMapComponent(),
        themeStore: this.getThemeStore(),
        selectedYear: this.selectedYear,
        mainPanel: this.getMainPanel(),
        entityStore: this.getEntityStore()
      });
    } else if (themeName === 'proposed-reservoirs') {
      this.interactiveTheme = new TNRIS.theme.ProposedReservoirsTheme({
        mapComp: this.getMapComponent(),
        themeStore: this.getThemeStore(),
        selectedYear: this.selectedYear,
        mainPanel: this.getMainPanel(),
        relatedWUGStore: this.getWaterUseEntityStore(),
        reservoirStore: this.getReservoirFeatureStore(),
        supplyStore: this.getReservoirSupplyDataStore()
      });
    }
    this.interactiveTheme.loadTheme();
    return null;
  }
});
