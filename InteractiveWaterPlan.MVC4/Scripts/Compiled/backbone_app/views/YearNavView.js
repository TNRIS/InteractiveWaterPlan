var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'scripts/text!templates/yearNav.html'], function(namespace, tpl) {
  var YearNavView, _ref;
  return YearNavView = (function(_super) {
    __extends(YearNavView, _super);

    function YearNavView() {
      _ref = YearNavView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    YearNavView.prototype.template = _.template(tpl);

    YearNavView.prototype.initialize = function(options) {
      _.bindAll(this, 'render', 'unrender', 'changeYear', 'disableYearButtons', 'enableYearButtons');
      return null;
    };

    YearNavView.prototype.render = function() {
      this.$el.empty();
      this.currentYear = ko.observable(namespace.currYear);
      this.$el.html(this.template());
      ko.applyBindings(this, this.el);
      this.$("a[data-value='" + namespace.currYear + "']").parent().addClass('active');
      return this;
    };

    YearNavView.prototype.disableYearButtons = function() {
      this.$('a').parents('li').addClass('disabled');
    };

    YearNavView.prototype.enableYearButtons = function() {
      this.$('a').parents('li').removeClass('disabled');
    };

    YearNavView.prototype.unrender = function() {
      kb.release(this);
      this.$el.remove();
      return null;
    };

    YearNavView.prototype.changeYear = function(data, event) {
      var $target, newYear;
      $target = $(event.target);
      newYear = $target.attr('data-value');
      this.trigger("changeyear", newYear);
      $target.parent().siblings().removeClass('active');
      $target.parent().addClass('active');
      return null;
    };

    return YearNavView;

  })(Backbone.View);
});
