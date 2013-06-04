var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'views/BaseStrategyCollectionView', 'views/StrategyTypeView', 'scripts/text!templates/strategyTypeTable.html'], function(namespace, BaseStrategyCollectionView, StrategyTypeView, tpl) {
  var StrategyTypeCollectionView, _ref;
  return StrategyTypeCollectionView = (function(_super) {
    __extends(StrategyTypeCollectionView, _super);

    function StrategyTypeCollectionView() {
      _ref = StrategyTypeCollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    StrategyTypeCollectionView.prototype.initialize = function(options) {
      var StrategyCollection, fetchParams;
      this.typeId = options.id;
      this.typeName = options.name;
      this.viewName = ko.observable("" + this.typeName);
      fetchParams = {
        typeId: this.typeId
      };
      StrategyCollection = Backbone.Collection.extend({
        url: "" + BASE_PATH + "api/strategies/type"
      });
      StrategyTypeCollectionView.__super__.initialize.call(this, StrategyTypeView, StrategyCollection, tpl, {
        fetchParams: fetchParams
      });
      return null;
    };

    return StrategyTypeCollectionView;

  })(BaseStrategyCollectionView);
});
