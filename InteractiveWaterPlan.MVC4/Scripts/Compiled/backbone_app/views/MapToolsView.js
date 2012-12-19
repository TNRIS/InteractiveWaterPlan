// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['scripts/text!templates/mapTools.html'], function(tpl) {
  var MapToolsView;
  return MapToolsView = (function(_super) {

    __extends(MapToolsView, _super);

    function MapToolsView() {
      return MapToolsView.__super__.constructor.apply(this, arguments);
    }

    MapToolsView.prototype.template = _.template(tpl);

    MapToolsView.prototype.mapView = null;

    MapToolsView.prototype.initialize = function(options) {
      _.bindAll(this, 'render', 'unrender', 'zoomToTexas');
      this.mapView = options.mapView;
    };

    MapToolsView.prototype.render = function() {
      this.$el.html(this.template());
      ko.applyBindings(this, this.el);
      return this;
    };

    MapToolsView.prototype.unrender = function() {
      this.$el.remove();
      return null;
    };

    MapToolsView.prototype.zoomToTexas = function() {
      this.mapView.resetExtent();
    };

    return MapToolsView;

  })(Backbone.View);
});
