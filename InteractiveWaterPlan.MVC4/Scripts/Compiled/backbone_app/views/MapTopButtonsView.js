// Generated by CoffeeScript 1.4.0
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'scripts/text!templates/mapTopButtons.html'], function(namespace, tpl) {
  var MapTopButtonsView;
  return MapTopButtonsView = (function(_super) {

    __extends(MapTopButtonsView, _super);

    function MapTopButtonsView() {
      return MapTopButtonsView.__super__.constructor.apply(this, arguments);
    }

    MapTopButtonsView.prototype.template = _.template(tpl);

    MapTopButtonsView.prototype.initialize = function(options) {
      _.bindAll(this, 'render', 'unrender', 'toggleMapViewLock', 'zoomToTexas', 'toggleMap');
      if (!(namespace.mapView != null)) {
        throw "namespace.mapView not defined";
      }
      this.mapView = namespace.mapView;
      return null;
    };

    MapTopButtonsView.prototype.render = function() {
      this.$el.empty();
      this.$el.html(this.template());
      ko.applyBindings(this, this.el);
      return this;
    };

    MapTopButtonsView.prototype.unrender = function() {
      this.$el.remove();
      return null;
    };

    MapTopButtonsView.prototype.toggleMapViewLock = function(data, event) {
      var $icon, $target, swap;
      $target = $(event.delegateTarget);
      $icon = $('i', $target);
      swap = $icon.attr('class');
      $icon.attr('class', $target.attr('data-other-icon-class'));
      $target.attr('data-other-icon-class', swap);
      if ($target.hasClass("locked")) {
        $target.removeClass("locked");
        this.mapView.isMapLocked = false;
      } else {
        $target.addClass("locked");
        this.mapView.isMapLocked = true;
      }
    };

    MapTopButtonsView.prototype.zoomToTexas = function() {
      this.mapView.resetExtent();
    };

    MapTopButtonsView.prototype.toggleMap = function(data, event) {
      var $target;
      $target = $(event.delegateTarget);
      if ($target.hasClass('off')) {
        $target.html('Hide Map');
        $('#mapContainer').slideDown();
        $('.map-stuff').show();
        $target.removeClass('off');
      } else {
        $target.addClass('off');
        $('#mapContainer').slideUp();
        $('.map-stuff').hide();
        $target.html('Show Map');
      }
    };

    return MapTopButtonsView;

  })(Backbone.View);
});
