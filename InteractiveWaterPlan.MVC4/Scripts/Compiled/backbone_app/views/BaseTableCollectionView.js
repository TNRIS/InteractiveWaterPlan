// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define([], function() {
  var BaseTableCollectionView;
  return BaseTableCollectionView = (function(_super) {

    __extends(BaseTableCollectionView, _super);

    function BaseTableCollectionView() {
      return BaseTableCollectionView.__super__.constructor.apply(this, arguments);
    }

    BaseTableCollectionView.prototype.currYear = null;

    BaseTableCollectionView.prototype.initialize = function(currYear, ModelView, Collection, tpl, options) {
      _.bindAll(this, 'render', 'unrender', 'fetchCollection', 'appendModel', 'hideLoading', 'showLoading', 'changeToYear', '_makeTableSortable');
      this.currYear = currYear;
      options = options || {};
      this.fetchParams = options.fetchParams || {};
      this.fetchParams = _.extend({
        year: this.currYear
      }, this.fetchParams);
      this.template = _.template(tpl);
      this.collection = new Collection();
      this.ModelView = ModelView;
      return null;
    };

    BaseTableCollectionView.prototype.render = function() {
      this.$el.html(this.template());
      this.fetchCollection();
      this._makeTableSortable();
      return this;
    };

    BaseTableCollectionView.prototype.unrender = function() {
      this.$el.html();
      return null;
    };

    BaseTableCollectionView.prototype.fetchCollection = function() {
      var _this = this;
      this.showLoading();
      this.$('tbody').empty();
      this.collection.fetch({
        data: this.fetchParams,
        success: function(collection) {
          var m, _i, _len, _ref;
          _ref = collection.models;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            m = _ref[_i];
            _this.appendModel(m);
          }
          _this.hideLoading();
          ko.applyBindings(_this, _this.$('tbody')[0]);
        }
      });
    };

    BaseTableCollectionView.prototype.appendModel = function(model) {
      var modelView;
      modelView = new this.ModelView({
        model: model
      });
      this.$('tbody').append(modelView.render().el);
      return null;
    };

    BaseTableCollectionView.prototype.showLoading = function() {
      this.$('.scrollTableContainer').hide();
      this.$('.loading').show();
      return null;
    };

    BaseTableCollectionView.prototype.hideLoading = function() {
      this.$('.scrollTableContainer').fadeIn();
      this.$('.loading').hide();
      return null;
    };

    BaseTableCollectionView.prototype.changeToYear = function(newYear) {
      this.currYear = newYear;
      this.fetchCollection();
    };

    BaseTableCollectionView.prototype._makeTableSortable = function() {
      var sortTable;
      sortTable = this.$('table').stupidtable({
        "formatted-int": function(a, b) {
          a = parseInt(a.replace(",", ""));
          b = parseInt(b.replace(",", ""));
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          return 0;
        }
      });
      sortTable.on('aftertablesort', function(evt, data) {
        var $th, iconClass;
        $th = $('th', this);
        $('i', $th).remove();
        iconClass = data.direction === "asc" ? 'icon-caret-up' : 'icon-caret-down';
        $th.eq(data.column).prepend("<i class='" + iconClass + "'></i> ");
        return null;
      });
    };

    return BaseTableCollectionView;

  })(Backbone.View);
});
