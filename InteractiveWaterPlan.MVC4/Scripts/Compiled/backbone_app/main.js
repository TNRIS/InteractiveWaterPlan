// Generated by CoffeeScript 1.3.3
var BASE_API_PATH, console;

console = console || {};

console.log = console.log || function() {
  return null;
};

_.extend(_.templateSettings, {
  interpolate: /\{\{(.+?)\}\}/g
});

BASE_API_PATH = "/";

$(function() {
  BASE_API_PATH = $("#base_path").val();
  require.config({
    baseUrl: "" + BASE_API_PATH + "Scripts/Compiled/backbone_app",
    paths: {
      "scripts": "../..",
      "templates": "../../templates"
    },
    urlArgs: "bust=" + (new Date()).getTime()
  });
  require(['ISWPApp'], function(ISWPApp) {
    ISWPApp.initialize();
  });
});