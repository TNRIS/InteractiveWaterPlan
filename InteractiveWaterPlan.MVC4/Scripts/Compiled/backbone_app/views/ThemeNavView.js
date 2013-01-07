// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['collections/StrategyTypeCollection', 'scripts/text!templates/strategyTypeListItem.html', 'scripts/text!templates/themeNav.html'], function(StrategyTypeCollection, strategyTypeListItemTpl, tpl) {
  var ThemeNavView;
  return ThemeNavView = (function(_super) {

    __extends(ThemeNavView, _super);

    function ThemeNavView() {
      return ThemeNavView.__super__.constructor.apply(this, arguments);
    }

    ThemeNavView.prototype.template = _.template(tpl);

    ThemeNavView.prototype.initialize = function() {
      _.bindAll(this, 'render', 'unrender', 'toggleMap', 'renderStrategyTypeList');
      return null;
    };

    ThemeNavView.prototype.render = function() {
      this.$el.empty();
      this.$el.html(this.template());
      this.renderStrategyTypeList();
      return this;
    };

    ThemeNavView.prototype.renderStrategyTypeList = function() {
      var stratTypeLiTemplate, typeCollection,
        _this = this;
      stratTypeLiTemplate = _.template(strategyTypeListItemTpl);
      typeCollection = new StrategyTypeCollection();
      typeCollection.fetch({
        success: function(collection) {
          var res, strategyType, _i, _len, _ref;
          _ref = collection.models;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            strategyType = _ref[_i];
            res = _this.$('#strategyTypeList').append(stratTypeLiTemplate({
              m: strategyType.toJSON()
            }));
          }
        }
      });
    };

    ThemeNavView.prototype.unrender = function() {
      this.$el.remove();
      return null;
    };

    ThemeNavView.prototype.toggleMap = function(data, event, x) {
      var $target;
      $target = $(event.target);
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

    return ThemeNavView;

  })(Backbone.View);
});
