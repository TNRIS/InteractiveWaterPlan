// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['scripts/text!templates/themeNav.html'], function(tpl) {
  var ThemeNavViewModel;
  return ThemeNavViewModel = (function(_super) {

    __extends(ThemeNavViewModel, _super);

    function ThemeNavViewModel() {
      return ThemeNavViewModel.__super__.constructor.apply(this, arguments);
    }

    ThemeNavViewModel.prototype.template = _.template(tpl);

    ThemeNavViewModel.prototype.render = function() {
      this.$el.empty();
      this.$el.html(this.template());
      ko.applyBindings(this, this.el);
      return this;
    };

    ThemeNavViewModel.prototype.unrender = function() {
      kb.release(this);
      this.$el.remove();
      return null;
    };

    ThemeNavViewModel.prototype.initialize = function() {
      this.$el = $(this.el);
      _.bindAll(this, 'render', 'unrender', 'changeStrategyView');
      return null;
    };

    ThemeNavViewModel.prototype.changeStrategyView = function(data, event) {
      var $target, newStrategyName;
      $target = $(event.target);
      newStrategyName = $target.attr('data-value');
      $target.parents('li.dropdown').addClass('active');
      $target.parents('li.dropdown').children('a.dropdown-toggle').children('span').html($target.html());
      return null;
    };

    return ThemeNavViewModel;

  })(Backbone.View);
});
