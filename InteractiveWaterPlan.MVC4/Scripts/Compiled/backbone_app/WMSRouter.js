var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/MapView', 'views/ThemeNavToolbarView', 'views/YearNavView', 'views/MapBottomToolbarView', 'views/CountyNetSupplyCollectionView', 'views/RegionStrategyCollectionView', 'views/CountyStrategyCollectionView', 'views/LegeDistrictCollectionView', 'views/StrategyTypeCollectionView', 'views/EntityStrategyCollectionView', 'views/ProjectStrategyCollectionView', 'views/SourceStrategyCollectionView', 'views/WmsAreaSelectView', 'views/MapTopButtonsView'], function(namespace, MapView, ThemeNavToolbarView, YearNavView, MapBottomToolbarView, CountyNetSupplyCollectionView, RegionStrategyCollectionView, CountyStrategyCollectionView, LegeDistrictCollectionView, StrategyTypeCollectionView, EntityStrategyCollectionView, ProjectStrategyCollectionView, SourceStrategyCollectionView, WmsAreaSelectView, MapTopButtonsView) {
  var WMSRouter, _ref;
  return WMSRouter = (function(_super) {
    __extends(WMSRouter, _super);

    function WMSRouter() {
      _ref = WMSRouter.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    WMSRouter.prototype.initialize = function(options) {
      _.bindAll(this, 'updateViewsToNewYear', 'updateSelectedWug', 'onTableStartLoad', 'onTableEndLoad', 'onTableNothingFound', 'onTableFetchError', 'highlightWugsByStrategyType');
      this.currStrategyView = null;
      this.tableContainer = $('#tableContainer')[0];
      this.mapView = new MapView({
        mapContainerId: 'mapContainer',
        bingApiKey: BING_MAPS_KEY
      });
      namespace.mapView = this.mapView;
      this.mapView.render();
      this.themeNavToolbarView = new ThemeNavToolbarView({
        el: $('#themeNavContainer')[0]
      });
      this.mapTopButtonsView = new MapTopButtonsView({
        el: $('#mapTopButtonsContainer')[0]
      });
      this.mapTopButtonsView.render();
      this.yearNavView = new YearNavView({
        el: $('#yearNavContainer')[0]
      });
      this.yearNavView.on("changeyear", this.updateViewsToNewYear);
      this.areaSelectView = new WmsAreaSelectView({
        el: $('#areaSelectContainer')[0]
      });
      this.areaSelectView.render();
    };

    WMSRouter.prototype.routes = {
      "": "default",
      ":year/wms": "wmsNetCountySupplies",
      ":year/wms/region/:regionLetter": "wmsRegion",
      ":year/wms/county/:countyId": "wmsCounty",
      ":year/wms/house/:districtId": "wmsHouseDistrict",
      ":year/wms/senate/:districtId": "wmsSenateDistrict",
      ":year/wms/type/:typeId": "wmsType",
      ":year/wms/entity/:entityId": "wmsEntity",
      ":year/wms/project/:projectId": "wmsProjectDetail",
      ":year/wms/source/:sourceId": "wmsSource"
    };

    WMSRouter.prototype.onTableStartLoad = function() {
      this.areaSelectView.disableSelects();
      this.yearNavView.disableYearButtons();
      this.themeNavToolbarView.disableStrategyTypeList();
      this.mapView.showMapLoading();
      this.currStrategyView.showLoading();
    };

    WMSRouter.prototype.onTableEndLoad = function() {
      this.areaSelectView.enableSelects();
      this.yearNavView.enableYearButtons();
      this.themeNavToolbarView.enableStrategyTypeList();
      this.mapView.hideMapLoading();
      this.currStrategyView.hideLoading();
    };

    WMSRouter.prototype.onTableFetchError = function() {
      $('#errorMessage').show();
      $('.contentContainer').hide();
    };

    WMSRouter.prototype.onTableNothingFound = function() {
      this.onTableEndLoad();
      this.currStrategyView.showNothingFound();
    };

    WMSRouter.prototype.updateSelectedWug = function(wugId) {
      if (wugId == null) {
        this.currStrategyView.unselectWugFeatures();
      } else {
        this.currStrategyView.selectWugFeature(wugId);
      }
    };

    WMSRouter.prototype.highlightWugsByStrategyType = function(stratTypeId) {
      if (stratTypeId == null) {
        this.currStrategyView.unhighlightStratTypeWugs();
      } else {
        this.currStrategyView.highlightStratTypeWugs(stratTypeId);
      }
    };

    WMSRouter.prototype.updateViewsToNewYear = function(newYear) {
      var currRoute, newRoute, oldYear, y, _i, _len, _ref1;
      currRoute = Backbone.history.fragment;
      oldYear = "";
      _ref1 = namespace.VALID_YEARS;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        y = _ref1[_i];
        if (currRoute.indexOf(y + "/") !== -1) {
          oldYear = y;
          break;
        }
      }
      if (oldYear === "") {
        Backbone.history.navigate("");
      }
      newRoute = currRoute.replace(oldYear, newYear);
      Backbone.history.navigate("#/" + newRoute, {
        trigger: true
      });
    };

    WMSRouter.prototype.before = {
      '': function() {
        $('#errorMessage').hide();
        $('.contentContainer').show();
      },
      '^[0-9]{4}/wms': function(year) {
        if (this.currStrategyView != null) {
          this.currStrategyView = this.currStrategyView.unrender();
        }
        if (year != null) {
          if (_.contains(namespace.VALID_YEARS, year)) {
            namespace.currYear = year;
          } else {
            alert("Invalid decade specified.");
            Backbone.history.navigate("", {
              trigger: true
            });
            return false;
          }
        }
      }
    };

    WMSRouter.prototype.after = {
      '^[0-9]{4}/wms': function(year) {
        if ((year != null) && (this.currStrategyView != null)) {
          this.themeNavToolbarView.render();
          this.yearNavView.render();
          this.currStrategyView.off();
          this.currStrategyView.on("table:startload", this.onTableStartLoad);
          this.currStrategyView.on("table:endload", this.onTableEndLoad);
          this.currStrategyView.on("table:nothingfound", this.onTableNothingFound);
          this.currStrategyView.on("table:fetcherror", this.onTableFetchError);
          this.currStrategyView.on("table:hoverwug", this.updateSelectedWug);
          this.currStrategyView.on("table:hovertype", this.highlightWugsByStrategyType);
          this.currStrategyView.render();
        }
      }
    };

    WMSRouter.prototype["default"] = function() {
      Backbone.history.navigate("#/" + namespace.currYear + "/wms", {
        trigger: true
      });
    };

    WMSRouter.prototype.wmsNetCountySupplies = function(year) {
      if (this.currStrategyView != null) {
        this.currStrategyView = this.currStrategyView.unrender();
      }
      this.currStrategyView = new CountyNetSupplyCollectionView({
        el: this.tableContainer
      });
      this.mapView.resetExtent();
      this.mapView.showWmsOverlayByViewType("Regions");
      this.areaSelectView.resetSelects();
    };

    WMSRouter.prototype.wmsRegion = function(year, regionLetter) {
      var region;
      region = namespace.regionNames.get(regionLetter);
      if (region == null) {
        alert("Invalid region specified.");
        Backbone.history.navigate("", {
          trigger: true
        });
        return;
      }
      this.currStrategyView = new RegionStrategyCollectionView({
        el: this.tableContainer,
        id: regionLetter
      });
      this.mapView.showWmsOverlayByViewType("Regions");
    };

    WMSRouter.prototype.wmsCounty = function(year, countyId) {
      var county, countyName;
      county = namespace.countyNames.get(countyId);
      if (county == null) {
        alert("Invalid countyId specified.");
        Backbone.history.navigate("", {
          trigger: true
        });
        return;
      }
      countyName = county.get('name');
      this.currStrategyView = new CountyStrategyCollectionView({
        el: this.tableContainer,
        id: countyId,
        name: countyName
      });
      this.mapView.showWmsOverlayByViewType("Counties");
    };

    WMSRouter.prototype.wmsHouseDistrict = function(year, districtId) {
      var district;
      district = namespace.houseNames.get(districtId);
      if (district == null) {
        alert("Invalid districtId specified.");
        Backbone.history.navigate("", {
          trigger: true
        });
        return;
      }
      this.currStrategyView = new LegeDistrictCollectionView({
        el: this.tableContainer,
        id: districtId,
        type: "house",
        name: district.get("name")
      });
      this.mapView.showWmsOverlayByViewType("HouseDistricts");
    };

    WMSRouter.prototype.wmsSenateDistrict = function(year, districtId) {
      var district;
      district = namespace.senateNames.get(districtId);
      if (district == null) {
        alert("Invalid districtId specified.");
        Backbone.history.navigate("", {
          trigger: true
        });
        return;
      }
      this.currStrategyView = new LegeDistrictCollectionView({
        el: this.tableContainer,
        id: districtId,
        type: "senate",
        name: district.get("name")
      });
      this.mapView.showWmsOverlayByViewType("SenateDistricts");
    };

    WMSRouter.prototype.wmsType = function(year, typeId) {
      var typeName, wmsType;
      wmsType = namespace.strategyTypes.get(typeId);
      if (wmsType == null) {
        alert("Invalid typeId specified.");
        Backbone.history.navigate("", {
          trigger: true
        });
        return;
      }
      typeName = wmsType.get('name');
      this.currStrategyView = new StrategyTypeCollectionView({
        el: this.tableContainer,
        id: typeId,
        name: typeName
      });
      this.areaSelectView.resetSelects();
    };

    WMSRouter.prototype.wmsEntity = function(year, entityId) {
      this.currStrategyView = new EntityStrategyCollectionView({
        el: this.tableContainer,
        id: entityId
      });
      this.areaSelectView.resetSelects();
      this.mapView.showWmsOverlayByViewType("CountyNames");
    };

    WMSRouter.prototype.wmsProjectDetail = function(year, projectId) {
      this.currStrategyView = new ProjectStrategyCollectionView({
        el: this.tableContainer,
        id: projectId
      });
      this.areaSelectView.resetSelects();
    };

    WMSRouter.prototype.wmsSource = function(year, sourceId) {
      this.currStrategyView = new SourceStrategyCollectionView({
        el: this.tableContainer,
        id: sourceId
      });
      this.areaSelectView.resetSelects();
      this.mapView.showWmsOverlayByViewType("CountyNames");
    };

    return WMSRouter;

  })(Backbone.Router);
});
