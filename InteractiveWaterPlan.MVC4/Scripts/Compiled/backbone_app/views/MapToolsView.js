// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['models/PlaceFeatureModel', 'scripts/text!templates/mapTools.html'], function(PlaceFeature, tpl) {
  var MapToolsView;
  return MapToolsView = (function(_super) {

    __extends(MapToolsView, _super);

    function MapToolsView() {
      return MapToolsView.__super__.constructor.apply(this, arguments);
    }

    MapToolsView.prototype.template = _.template(tpl);

    MapToolsView.prototype.mapView = null;

    MapToolsView.prototype.initialize = function(options) {
      _.bindAll(this, 'render', 'unrender', 'showPlaceFeature');
      this.mapView = options.mapView;
    };

    MapToolsView.prototype.render = function() {
      this.$el.html(this.template());
      ko.applyBindings(this, this.el);
      this.$('#goToPlaceInput').place_typeahead({
        minLength: 2,
        source: function(query, process) {
          this.$element.data('selected-place-id', null);
          return $.get("" + BASE_API_PATH + "api/place", {
            name: query
          }, function(places) {
            return process(places);
          });
        },
        buttonClick: this.showPlaceFeature
      });
      return this;
    };

    MapToolsView.prototype.unrender = function() {
      this.$el.remove();
      return null;
    };

    MapToolsView.prototype.showPlaceFeature = function() {
      var placeFeature, selectedPlaceId,
        _this = this;
      selectedPlaceId = this.$('#goToPlaceInput').data('selected-place-id');
      placeFeature = new PlaceFeature();
      placeFeature.fetch({
        data: {
          placeId: selectedPlaceId
        },
        success: function(model) {
          return _this.mapView.showPlaceFeature(model);
        }
      });
    };

    return MapToolsView;

  })(Backbone.View);
});
