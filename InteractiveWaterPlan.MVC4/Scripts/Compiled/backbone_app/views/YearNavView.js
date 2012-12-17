// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['scripts/text!templates/yearNav.html'], function(tpl) {
  var YearNavView;
  return YearNavView = (function(_super) {

    __extends(YearNavView, _super);

    function YearNavView() {
      return YearNavView.__super__.constructor.apply(this, arguments);
    }

    YearNavView.prototype.activeYear = '2040';

    YearNavView.prototype.template = _.template(tpl);

    YearNavView.prototype.render = function() {
      this.$el.empty();
      this.$el.html(this.template());
      ko.applyBindings(this, this.el);
      this.$("a[data-value='" + this.activeYear + "']").parent().addClass('active');
      return this;
    };

    YearNavView.prototype.unrender = function() {
      kb.release(this);
      this.$el.remove();
      return null;
    };

    YearNavView.prototype.initialize = function() {
      _.bindAll(this, 'render', 'unrender', 'changeYear');
      return null;
    };

    YearNavView.prototype.changeYear = function(data, event) {
      var $target, newYear;
      $target = $(event.target);
      newYear = $target.attr('data-value');
      $target.parent().siblings().removeClass('active');
      $target.parent().addClass('active');
      return null;
    };

    return YearNavView;

  })(Backbone.View);
});
