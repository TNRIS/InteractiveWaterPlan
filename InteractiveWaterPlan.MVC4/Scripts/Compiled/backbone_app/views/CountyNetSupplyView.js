var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyView', 'scripts/text!templates/countyNetSupplyRow.html'], function(namespace, BaseStrategyView, tpl) {
  var CountyNetSupplyView, _ref;
  return CountyNetSupplyView = (function(_super) {
    __extends(CountyNetSupplyView, _super);

    function CountyNetSupplyView() {
      _ref = CountyNetSupplyView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    CountyNetSupplyView.prototype.template = tpl;

    return CountyNetSupplyView;

  })(BaseStrategyView);
});
