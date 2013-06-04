var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'models/PlaceFeatureModel', 'scripts/text!templates/mapBottomRightTools.html'], function(namespace, PlaceFeature, tpl) {
  var MapBottomToolbarView, _ref;
  return MapBottomToolbarView = (function(_super) {
    __extends(MapBottomToolbarView, _super);

    function MapBottomToolbarView() {
      _ref = MapBottomToolbarView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MapBottomToolbarView.prototype.template = _.template(tpl);

    MapBottomToolbarView.prototype.initialize = function(options) {
      _.bindAll(this, 'render', 'unrender', 'showPlaceFeature');
      this.mapView = namespace.mapView;
    };

    MapBottomToolbarView.prototype.render = function() {
      this.$el.html(this.template());
      ko.applyBindings(this, this.el);
      this.$('#goToPlaceInput').place_typeahead({
        minLength: 2,
        source: function(query, process) {
          this.$element.data('selected-place-id', null);
          return $.get("" + BASE_PATH + "api/place", {
            name: query
          }, function(places) {
            return process(places);
          });
        },
        buttonClick: this.showPlaceFeature
      });
      return this;
    };

    MapBottomToolbarView.prototype.unrender = function() {
      this.$el.remove();
      return null;
    };

    MapBottomToolbarView.prototype.toggleAreaSelects = function(data, event) {
      var $target, toggleSelector;
      $target = $(event.delegateTarget);
      toggleSelector = $target.data('toggle');
      $(toggleSelector).slideToggle(300, function() {
        var $i, oldTitle;
        $i = $('i', $target);
        if ($i.hasClass('icon-caret-up')) {
          $i.removeClass('icon-caret-up');
          $i.addClass('icon-caret-down');
        } else {
          $i.addClass('icon-caret-up');
          $i.removeClass('icon-caret-down');
        }
        oldTitle = $('.title', $target).html();
        $('.title', $target).html($target.attr('data-title-orig'));
        return $target.attr('data-title-orig', oldTitle);
      });
    };

    MapBottomToolbarView.prototype.showPlaceFeature = function() {
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

    return MapBottomToolbarView;

  })(Backbone.View);
});
