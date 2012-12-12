// Generated by CoffeeScript 1.3.3

Ext.define('ISWP.controller.Main', {
  extend: 'Ext.app.Controller',
  views: ['data.MainContainer', 'map.MapComponent', 'map.ThemeYearMapPanel', 'theme.RecommendedReservoirsPanel', 'theme.ExistingSupplyPanel'],
  stores: ['WaterUseData', 'Theme', 'WaterUseEntity', 'Entity', 'Place', 'PlaceFeature', 'ReservoirFeature', 'ReservoirSupplyData', 'RWP', 'County'],
  refs: [
    {
      ref: 'mainContainer',
      selector: '#mainContainer'
    }, {
      ref: 'themeYearMapPanel',
      selector: 'themeyearmappanel'
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
          this._loadThemeIntoMap(this.selectedTheme);
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
          this._loadThemeIntoMap(btn.theme);
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
  _loadThemeIntoMap: function(themeName) {
    if (this.interactiveTheme != null) {
      this.interactiveTheme.unload();
    }
    switch (themeName) {
      case 'existing-supply':
        this.interactiveTheme = new TNRIS.theme.ExistingSupplyTheme({
          mapComp: this.getMapComponent(),
          selectedYear: this.selectedYear,
          mainContainer: this.getMainContainer(),
          entityStore: this.getEntityStore()
        });
        break;
      case 'recommended-reservoirs':
        this.interactiveTheme = new TNRIS.theme.RecommendedReservoirsTheme({
          mapComp: this.getMapComponent(),
          selectedYear: this.selectedYear,
          mainContainer: this.getMainContainer(),
          relatedWUGStore: this.getWaterUseEntityStore(),
          reservoirStore: this.getReservoirFeatureStore(),
          supplyStore: this.getReservoirSupplyDataStore()
        });
        break;
      case 'strategies':
        this.interactiveTheme = new TNRIS.theme.StrategiesTheme({
          mapComp: this.getMapComponent(),
          selectedYear: this.selectedYear,
          mainContainer: this.getMainContainer()
        });
    }
    this.interactiveTheme.load();
    return null;
  }
});
