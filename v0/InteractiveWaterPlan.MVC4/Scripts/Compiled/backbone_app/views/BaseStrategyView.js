var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace'], function(namespace) {
  var BaseStrategyView, _ref;
  return BaseStrategyView = (function(_super) {
    __extends(BaseStrategyView, _super);

    function BaseStrategyView() {
      _ref = BaseStrategyView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BaseStrategyView.prototype.tagName = 'tr';

    BaseStrategyView.prototype.initialize = function(options) {
      if ((this.template == null) && (options.template == null)) {
        throw "Must specify template";
      }
      if (options.template != null) {
        this.template = options.template;
      }
      BaseStrategyView.__super__.initialize.call(this, options);
      _.bindAll(this, 'render', 'unrender');
      this.template = _.template(this.template);
      return null;
    };

    BaseStrategyView.prototype.render = function() {
      this.$el.html(this.template({
        m: this.model.toJSON(),
        currYear: namespace.currYear
      }));
      this.$el.attr('data-entity-id', this.model.get("recipientEntityId"));
      return this;
    };

    BaseStrategyView.prototype.unrender = function() {
      this.$el.remove();
      return null;
    };

    return BaseStrategyView;

  })(Backbone.View);
});
