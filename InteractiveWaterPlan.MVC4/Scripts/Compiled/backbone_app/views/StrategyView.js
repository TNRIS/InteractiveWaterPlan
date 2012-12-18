// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['scripts/text!templates/strategyRow.html'], function(tpl) {
  var StrategyView;
  return StrategyView = (function(_super) {

    __extends(StrategyView, _super);

    function StrategyView() {
      return StrategyView.__super__.constructor.apply(this, arguments);
    }

    StrategyView.prototype.tagName = 'tr';

    StrategyView.prototype.initialize = function() {
      _.bindAll(this, 'render', 'unrender');
      this.template = _.template(tpl);
      return null;
    };

    StrategyView.prototype.render = function() {
      this.$el.html(this.template({
        m: this.model.toJSON()
      }));
      return this;
    };

    StrategyView.prototype.unrender = function() {
      this.$el.remove();
      return null;
    };

    return StrategyView;

  })(Backbone.View);
});