var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyView', 'scripts/text!templates/projectStrategyRow.html'], function(namespace, BaseStrategyView, tpl) {
  var ProjectStrategyView, _ref;
  return ProjectStrategyView = (function(_super) {
    __extends(ProjectStrategyView, _super);

    function ProjectStrategyView() {
      _ref = ProjectStrategyView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ProjectStrategyView.prototype.template = tpl;

    return ProjectStrategyView;

  })(BaseStrategyView);
});
