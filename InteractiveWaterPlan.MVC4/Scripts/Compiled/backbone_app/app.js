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
  var Workspace;
  BASE_API_PATH = $("#base_path").val();
  Workspace = new Backbone.Router({
    routes: {}
  });
  return define(['views/AppView'], function(AppView) {
    var appView;
    appView = new AppView({
      el: $('#appContainer')[0]
    });
    appView.render();
  });
});
