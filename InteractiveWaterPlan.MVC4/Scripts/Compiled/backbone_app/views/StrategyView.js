var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyView', 'scripts/text!templates/strategyRow.html'], function(namespace, BaseStrategyView, tpl) {
  var StrategyView, _ref;
  return StrategyView = (function(_super) {
    __extends(StrategyView, _super);

    function StrategyView() {
      _ref = StrategyView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    StrategyView.prototype.template = tpl;

    return StrategyView;

  })(BaseStrategyView);
});
