var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'collections/StrategyTypeCollection', 'scripts/text!templates/strategyTypeListItem.html', 'scripts/text!templates/themeNav.html'], function(namespace, StrategyTypeCollection, strategyTypeListItemTpl, tpl) {
  var ThemeNavToolbarView, _ref;
  return ThemeNavToolbarView = (function(_super) {
    __extends(ThemeNavToolbarView, _super);

    function ThemeNavToolbarView() {
      _ref = ThemeNavToolbarView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ThemeNavToolbarView.prototype.template = _.template(tpl);

    ThemeNavToolbarView.prototype.initialize = function(options) {
      _.bindAll(this, 'render', 'unrender', 'renderStrategyTypeList', 'enableStrategyTypeList', 'disableStrategyTypeList');
      return null;
    };

    ThemeNavToolbarView.prototype.render = function() {
      this.$el.empty();
      this.$el.html(this.template({
        currYear: namespace.currYear
      }));
      ko.applyBindings(this, this.el);
      this.renderStrategyTypeList();
      return this;
    };

    ThemeNavToolbarView.prototype.renderStrategyTypeList = function() {
      var stratTypeLiTemplate, typeCollection,
        _this = this;
      stratTypeLiTemplate = _.template(strategyTypeListItemTpl);
      typeCollection = new StrategyTypeCollection();
      typeCollection.fetch({
        success: function(collection) {
          var res, strategyType, _i, _len, _ref1;
          _ref1 = collection.models;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            strategyType = _ref1[_i];
            res = _this.$('#strategyTypeList').append(stratTypeLiTemplate({
              m: strategyType.toJSON(),
              currYear: namespace.currYear
            }));
          }
        }
      });
    };

    ThemeNavToolbarView.prototype.disableStrategyTypeList = function() {
      this.$('.dropdown-toggle').attr('data-toggle', null).parent('li').addClass('disabled').on('click.me', function(event) {
        event.preventDefault();
      });
    };

    ThemeNavToolbarView.prototype.enableStrategyTypeList = function() {
      this.$('.dropdown-toggle').attr('data-toggle', 'dropdown').parent('li').removeClass('disabled').off('click.me');
    };

    ThemeNavToolbarView.prototype.unrender = function() {
      this.$el.remove();
      return null;
    };

    return ThemeNavToolbarView;

  })(Backbone.View);
});
