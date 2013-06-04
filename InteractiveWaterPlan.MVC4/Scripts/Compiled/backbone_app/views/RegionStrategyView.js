var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyView', 'scripts/text!templates/regionStrategyRow.html'], function(namespace, BaseStrategyView, tpl) {
  var RegionStrategyView, _ref;
  return RegionStrategyView = (function(_super) {
    __extends(RegionStrategyView, _super);

    function RegionStrategyView() {
      _ref = RegionStrategyView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    RegionStrategyView.prototype.template = tpl;

    return RegionStrategyView;

  })(BaseStrategyView);
});
