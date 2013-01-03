// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['scripts/text!templates/strategyTypeListItem.html', 'scripts/text!templates/themeNav.html'], function(strategyTypeListItemTpl, tpl) {
  var ThemeNavView;
  return ThemeNavView = (function(_super) {

    __extends(ThemeNavView, _super);

    function ThemeNavView() {
      return ThemeNavView.__super__.constructor.apply(this, arguments);
    }

    ThemeNavView.prototype.template = _.template(tpl);

    ThemeNavView.prototype.initialize = function() {
      _.bindAll(this, 'render', 'unrender', 'toggleMap', 'renderStrategyTypeList', 'changeStrategyView');
      this.selectedType = ko.observable();
      return null;
    };

    ThemeNavView.prototype.render = function() {
      this.$el.empty();
      this.$el.html(this.template());
      this.renderStrategyTypeList();
      ko.applyBindings(this, this.el);
      return this;
    };

    ThemeNavView.prototype.renderStrategyTypeList = function() {
      var TypeCollection, stratTypeLiTemplate, typeCollection,
        _this = this;
      stratTypeLiTemplate = _.template(strategyTypeListItemTpl);
      TypeCollection = Backbone.Collection.extend({
        url: "" + BASE_API_PATH + "api/strategy/types"
      });
      typeCollection = new TypeCollection();
      typeCollection.fetch({
        success: function(collection) {
          var res, strategyType, _i, _len, _ref;
          _ref = collection.models;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            strategyType = _ref[_i];
            res = _this.$('#strategyTypeList').append(stratTypeLiTemplate({
              m: strategyType.toJSON()
            }));
            ko.applyBindings(_this, $('a:last', res)[0]);
          }
        }
      });
    };

    ThemeNavView.prototype.unrender = function() {
      this.$el.remove();
      return null;
    };

    ThemeNavView.prototype.toggleMap = function(data, target) {
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

    ThemeNavView.prototype.changeStrategyView = function(data, event) {
      var $target, newStrategyType, txt;
      $target = $(event.target);
      newStrategyType = $target.data('type');
      $target.parents('li.dropdown').addClass('active');
      txt = 'Water Management Strategies';
      if (newStrategyType !== 'net-supplies') {
        txt = $target.html();
      }
      $target.parents('li.dropdown').children('a.dropdown-toggle').children('span').html(txt);
      this.selectedType({
        type: $target.data('type'),
        id: $target.data('id'),
        name: $target.data('name')
      });
      return null;
    };

    return ThemeNavView;

  })(Backbone.View);
});
