var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyView', 'scripts/text!templates/districtStrategyRow.html'], function(namespace, BaseStrategyView, tpl) {
  var DistrictStrategyView, _ref;
  return DistrictStrategyView = (function(_super) {
    __extends(DistrictStrategyView, _super);

    function DistrictStrategyView() {
      _ref = DistrictStrategyView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DistrictStrategyView.prototype.template = tpl;

    return DistrictStrategyView;

  })(BaseStrategyView);
});
