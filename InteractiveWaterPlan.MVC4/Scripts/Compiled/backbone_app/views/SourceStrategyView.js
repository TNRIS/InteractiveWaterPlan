var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyView', 'scripts/text!templates/sourceStrategyRow.html'], function(namespace, BaseStrategyView, tpl) {
  var SourceStrategyView, _ref;
  return SourceStrategyView = (function(_super) {
    __extends(SourceStrategyView, _super);

    function SourceStrategyView() {
      _ref = SourceStrategyView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SourceStrategyView.prototype.template = tpl;

    return SourceStrategyView;

  })(BaseStrategyView);
});
