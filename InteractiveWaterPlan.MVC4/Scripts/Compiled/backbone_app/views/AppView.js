// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['views/MapView', 'views/ThemeNavView', 'views/YearNavView', 'views/BreadcrumbView', 'views/CountyNetSupplyCollectionView', 'views/RegionStrategyCollectionView', 'views/CountyStrategyCollectionView', 'scripts/text!templates/appContainer.html'], function(MapView, ThemeNavView, YearNavView, BreadcrumbView, CountyNetSupplyCollectionView, RegionStrategyCollectionView, CountyStrategyCollectionView, tpl) {
  var AppView;
  return AppView = (function(_super) {

    __extends(AppView, _super);

    function AppView() {
      return AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.currYear = "2010";

    AppView.prototype.initialize = function(options) {
      _.bindAll(this, 'render', 'unrender', 'updateViewsToNewYear', 'switchStrategyThemeView');
      this.template = _.template(tpl);
    };

    AppView.prototype.render = function() {
      this.$el.html(this.template());
      this.tableContainer = $('#tableContainer')[0];
      this.mapView = new MapView('mapContainer');
      this.mapView.render();
      this.themeNavView = new ThemeNavView({
        el: $('#themeNavContainer')[0]
      });
      this.themeNavView.render();
      this.yearNavView = new YearNavView({
        startingYear: this.currYear,
        el: $('#yearNavContainer')[0]
      });
      this.yearNavView.render();
      this.yearNavView.currentYear.subscribe(this.updateViewsToNewYear);
      this.breadcrumbList = new BreadcrumbView({
        el: $('#breadcrumbContainer')[0]
      });
      this.breadcrumbList.render();
      this.switchStrategyThemeView('net-supplies');
      return this;
    };

    AppView.prototype.unrender = function() {
      this.el.remove();
      return null;
    };

    AppView.prototype.updateViewsToNewYear = function(newYear) {
      this.currYear = newYear;
      this.currTableView.changeToYear(newYear);
    };

    AppView.prototype.switchStrategyThemeView = function(type, options) {
      var _this = this;
      if (this.currTableView != null) {
        this.currTableView = this.currTableView.unrender();
      }
      switch (type) {
        case 'net-supplies':
          this.currTableView = new CountyNetSupplyCollectionView({
            currYear: this.currYear,
            el: this.tableContainer
          });
          this.currTableView.render();
          this.currTableView.selectedCounty.subscribe(function(val) {
            return _this.switchStrategyThemeView("county", {
              countyId: val.countyId,
              countyName: val.countyName
            });
          });
          this.currTableView.selectedRegion.subscribe(function(val) {
            return _this.switchStrategyThemeView("region", {
              regionId: val.regionId,
              regionName: val.regionName
            });
          });
          break;
        case 'county':
          this.currTableView = new CountyStrategyCollectionView({
            el: this.tableContainer,
            currYear: this.currYear,
            countyId: options.countyId,
            countyName: options.countyName
          });
          this.currTableView.render();
          return;
        case 'region':
          this.currTableView = new RegionStrategyCollectionView({
            el: this.tableContainer,
            currYear: this.currYear,
            regionId: options.regionId,
            regionName: options.regionName
          });
          this.currTableView.render();
          return;
        case 'type':
          return;
      }
    };

    return AppView;

  })(Backbone.View);
});