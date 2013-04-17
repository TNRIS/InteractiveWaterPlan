// Generated by CoffeeScript 1.6.2
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyCollectionView', 'views/StrategyDetailView', 'scripts/text!templates/strategyDetailTable.html'], function(namespace, BaseStrategyCollectionView, StrategyDetailView, tpl) {
  var StrategyDetailCollectionView, _ref;

  return StrategyDetailCollectionView = (function(_super) {
    __extends(StrategyDetailCollectionView, _super);

    function StrategyDetailCollectionView() {
      _ref = StrategyDetailCollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    StrategyDetailCollectionView.prototype.initialize = function(options) {
      var StrategyDetailCollection, fetchParams;

      _.bindAll(this, 'fetchCallback');
      this.projectId = options.id;
      this.viewName = ko.observable();
      fetchParams = {
        projectId: this.projectId
      };
      StrategyDetailCollection = Backbone.Collection.extend({
        url: "" + BASE_PATH + "api/strategies/project"
      });
      StrategyDetailCollectionView.__super__.initialize.call(this, StrategyDetailView, StrategyDetailCollection, tpl, {
        fetchParams: fetchParams
      });
      return null;
    };

    StrategyDetailCollectionView.prototype.fetchCallback = function(strategyModels) {
      if (strategyModels.length < (1 != null)) {
        alert("Invalid projectId specified.");
        Backbone.history.navigate("", {
          trigger: true
        });
      }
      this.viewName(strategyModels[0].get("description"));
      StrategyDetailCollectionView.__super__.fetchCallback.call(this, strategyModels);
    };

    return StrategyDetailCollectionView;

  })(BaseStrategyCollectionView);
});
