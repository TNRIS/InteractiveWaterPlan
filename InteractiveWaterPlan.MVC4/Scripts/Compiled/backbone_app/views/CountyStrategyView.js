var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyView', 'scripts/text!templates/countyStrategyRow.html'], function(namespace, BaseStrategyView, tpl) {
  var CountyStrategyView, _ref;
  return CountyStrategyView = (function(_super) {
    __extends(CountyStrategyView, _super);

    function CountyStrategyView() {
      _ref = CountyStrategyView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    CountyStrategyView.prototype.template = tpl;

    return CountyStrategyView;

  })(BaseStrategyView);
});
