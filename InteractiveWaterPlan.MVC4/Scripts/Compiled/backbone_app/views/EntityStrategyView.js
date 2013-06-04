var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyView', 'scripts/text!templates/entityStrategyRow.html'], function(namespace, BaseStrategyView, tpl) {
  var EntityStrategyView, _ref;
  return EntityStrategyView = (function(_super) {
    __extends(EntityStrategyView, _super);

    function EntityStrategyView() {
      _ref = EntityStrategyView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    EntityStrategyView.prototype.template = tpl;

    return EntityStrategyView;

  })(BaseStrategyView);
});
