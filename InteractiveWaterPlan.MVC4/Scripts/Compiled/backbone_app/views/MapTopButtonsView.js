// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['scripts/text!templates/mapTopButtons.html'], function(tpl) {
  var MapTopButtonsView;
  return MapTopButtonsView = (function(_super) {

    __extends(MapTopButtonsView, _super);

    function MapTopButtonsView() {
      return MapTopButtonsView.__super__.constructor.apply(this, arguments);
    }

    MapTopButtonsView.prototype.template = _.template(tpl);

    MapTopButtonsView.prototype.initialize = function(options) {
      _.bindAll(this, 'render', 'unrender', 'zoomToTexas', 'toggleMap');
      if (!(options.mapView != null)) {
        throw "options.mapView not defined";
      }
      this.mapView = options.mapView;
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

    MapTopButtonsView.prototype.zoomToTexas = function() {
      this.mapView.resetExtent();
    };

    MapTopButtonsView.prototype.toggleMap = function(data, event, $el) {
      var $target;
      if ($el != null) {
        $target = $el;
      } else {
        $target = $(event.target);
      }
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
