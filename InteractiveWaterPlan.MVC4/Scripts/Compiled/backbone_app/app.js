// Generated by CoffeeScript 1.3.3
﻿;

var BASE_API_PATH, console;

console = console || {};

console.log = console.log || function() {
  return null;
};

_.extend(_.templateSettings, {
  interpolate: /\{\{(.+?)\}\}/g
});

BASE_API_PATH = "/";

require.config({
  paths: {
    "scripts": "../..",
    "templates": "../../templates"
  },
  urlArgs: "bust=" + (new Date()).getTime()
});

$(function() {
  BASE_API_PATH = $("#base_path").val();
  return define(['views/MapView', 'views/ThemeNavViewModel', 'views/YearNavViewModel', 'views/BreadcrumbViewModel', 'views/StrategyViewModel', 'scripts/text!templates/mainView.html'], function(MapView, ThemeNavViewModel, YearNavViewModel, BreadcrumbViewModel, StrategyViewModel, tpl) {
    var breadcrumbList, themeNavView, yearNavView;
    this.mapView = new MapView('mapContainer');
    this.mapView.render();
    themeNavView = new ThemeNavViewModel();
    $('#themeNavContainer').html(themeNavView.render().el);
    yearNavView = new YearNavViewModel();
    $('#yearNavContainer').html(yearNavView.render().el);
    breadcrumbList = new BreadcrumbViewModel();
    $('#breadcrumbContainer').html(breadcrumbList.render().el);
    return null;
  });
});