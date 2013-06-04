var BASE_CONTENT_PATH, BASE_PATH, BING_MAPS_KEY, console;

console = console || {};

console.log = console.log || function() {
  return null;
};

_.extend(_.templateSettings, {
  interpolate: /\{\{(.+?)\}\}/g
});

BASE_PATH = base_path || "/";

BASE_CONTENT_PATH = base_content_path || "/";

BING_MAPS_KEY = bing_maps_key || "";

require(['namespace', 'WMSRouter'], function(namespace, WMSRouter) {
  var MyHistory;
  MyHistory = Backbone.History.extend({
    loadUrl: function() {
      var match;
      match = Backbone.History.prototype.loadUrl.apply(this, arguments);
      if (!match) {
        this.trigger('route-not-found');
      }
      return match;
    }
  });
  Backbone.history = new MyHistory();
  Backbone.history.on("route-not-found", function() {
    Backbone.history.navigate("", {
      trigger: true
    });
  });
  $('.tableLoading').show();
  return namespace.bootstrapData().done(function() {
    var r;
    r = new WMSRouter();
    Backbone.history.start();
  }).fail(function() {
    $('#errorMessage').show();
    $('.contentContainer').hide();
  }).always(function() {
    $('.tableLoading').hide();
  });
});
