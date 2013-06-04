var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyView', 'scripts/text!templates/strategyTypeRow.html'], function(namespace, BaseStrategyView, tpl) {
  var StrategyTypeView, _ref;
  return StrategyTypeView = (function(_super) {
    __extends(StrategyTypeView, _super);

    function StrategyTypeView() {
      _ref = StrategyTypeView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    StrategyTypeView.prototype.template = tpl;

    return StrategyTypeView;

  })(BaseStrategyView);
});
