// Generated by CoffeeScript 1.3.3

Ext.define('ISWP.controller.Main', {
  extend: 'Ext.app.Controller',
  views: ['chart.WaterUseChart', 'data.MainPanel', 'map.MapComponent', 'map.ThemeYearMapPanel'],
  stores: ['WaterUseData', 'Theme', 'WaterUseEntity', 'Entity', 'Place', 'PlaceFeature'],
  refs: [
    {
      ref: 'mainPanel',
      selector: 'mainpanel'
    }, {
      ref: 'themeYearMapPanel',
      selector: 'themeyearmappanel'
    }, {
      ref: 'mainChart',
      selector: '#mainChart'
    }, {
      ref: 'mainContent',
      selector: '#mainContent'
    }, {
      ref: 'mapComponent',
      selector: 'mapcomponent'
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
          this.loadThemeIntoMap(this.selectedTheme);
          return null;
        },
        nofeaturefound: function(mapComp, evt) {
          mapComp.removePopupsFromMap();
          return null;
        },
        getfeature: function(mapComp, evt) {
          this.interactiveTheme.showFeatureResult(evt.features, evt.xy, this.selectedYear);
          return null;
        }
      },
      'button[toggleGroup=yearButtons]': {
        click: function(btn, evt) {
          this.selectedYear = btn.year;
          this.getMainChart().store.load({
            params: {
              Year: btn.year,
              LocationType: 'State',
              LocationName: 'Texas'
            }
          });
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
              var bounds, placeFeature, wktFormat;
              if (!(success && records.length === 1)) {
                return null;
              }
              wktFormat = new OpenLayers.Format.WKT();
              placeFeature = wktFormat.read(records[0].data.WKTGeog);
              bounds = placeFeature.geometry.getBounds();
              bounds = this.getMapComponent().transformToWebMerc(bounds);
              this.getMapComponent().zoomToExtent(bounds);
              return null;
            }
          });
          return null;
        }
      },
      '#mainChart': {
        render: function(chart) {
          this.selectedYear = this.getThemeYearMapPanel().getSelectedYear();
          chart.store.load({
            params: {
              Year: this.selectedYear,
              LocationType: 'State',
              LocationName: 'Texas'
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
        themeName: themeName,
        dataStore: this.getEntityStore(),
        contentPanel: this.getMainContent()
      });
    } else if (themeName === 'proposed-reservoirs') {
      this.interactiveTheme = new TNRIS.theme.ProposedReservoirsTheme({
        mapComp: this.getMapComponent(),
        themeStore: this.getThemeStore(),
        themeName: themeName,
        dataStore: this.getWaterUseEntityStore(),
        contentPanel: this.getMainContent()
      });
    }
    this.interactiveTheme.loadTheme();
    return null;
  }
});
