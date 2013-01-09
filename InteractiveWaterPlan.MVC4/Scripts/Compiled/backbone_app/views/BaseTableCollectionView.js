// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace'], function(namespace) {
  var BaseTableCollectionView;
  return BaseTableCollectionView = (function(_super) {

    __extends(BaseTableCollectionView, _super);

    function BaseTableCollectionView() {
      return BaseTableCollectionView.__super__.constructor.apply(this, arguments);
    }

    BaseTableCollectionView.prototype.fetchCallback = null;

    BaseTableCollectionView.prototype.initialize = function(ModelView, Collection, tpl, options) {
      _.bindAll(this, 'render', 'unrender', 'fetchCollection', 'appendModel', 'hideLoading', 'showLoading', '_makeTableSortable');
      options = options || {};
      this.fetchParams = options.fetchParams || {};
      this.currYear = ko.observable(namespace.currYear);
      this.template = _.template(tpl);
      this.collection = new Collection();
      this.ModelView = ModelView;
      return null;
    };

    BaseTableCollectionView.prototype.render = function() {
      this.$el.html(this.template());
      this.fetchCollection();
      this._makeTableSortable();
      ko.applyBindings(this, this.el);
      this.$('.has-popover').popover({
        trigger: 'hover',
        placement: 'top'
      });
      return this;
    };

    BaseTableCollectionView.prototype.unrender = function() {
      this.$el.html();
      return null;
    };

    BaseTableCollectionView.prototype.fetchCollection = function() {
      var params,
        _this = this;
      this.hideNothingFound();
      this.showLoading();
      this.$('tbody').empty();
      params = _.extend({
        year: namespace.currYear
      }, this.fetchParams);
      this.collection.fetch({
        data: params,
        success: function(collection) {
          var m, _i, _len, _ref;
          if (collection.models.length > 0) {
            _ref = collection.models;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              m = _ref[_i];
              _this.appendModel(m);
            }
            _this.hideLoading();
            ko.applyBindings(_this, _this.$('tbody')[0]);
          } else {
            _this.hideLoading();
            _this.showNothingFound();
          }
          if ((_this.fetchCallback != null) && _.isFunction(_this.fetchCallback)) {
            _this.fetchCallback(collection.models);
          }
        }
      });
    };

    BaseTableCollectionView.prototype.appendModel = function(model) {
      var modelView;
      modelView = new this.ModelView({
        model: model,
        currYear: namespace.currYear
      });
      this.$('tbody').append(modelView.render().el);
    };

    BaseTableCollectionView.prototype.showNothingFound = function() {
      $('#nothingFound').fadeIn();
      $('.scrollTableContainer').hide();
    };

    BaseTableCollectionView.prototype.hideNothingFound = function() {
      $('#nothingFound').hide();
    };

    BaseTableCollectionView.prototype.showLoading = function() {
      this.$('.scrollTableContainer').hide();
      $('.tableLoading').show();
    };

    BaseTableCollectionView.prototype.hideLoading = function() {
      $('.tableLoading').hide();
      this.$('.scrollTableContainer').fadeIn();
    };

    BaseTableCollectionView.prototype._makeTableSortable = function() {
      var sortTable;
      sortTable = this.$('table').stupidtable({
        "formatted-int": function(a, b) {
          a = parseInt(a.replace(/,/g, ""));
          b = parseInt(b.replace(/,/g, ""));
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          return 0;
        },
        "formatted-currency": function(a, b) {
          a = parseInt(a.replace(/,/g, "").replace("$", ""));
          b = parseInt(b.replace(/,/g, "").replace("$", ""));
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
