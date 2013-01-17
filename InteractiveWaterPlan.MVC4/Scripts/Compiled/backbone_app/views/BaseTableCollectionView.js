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

    BaseTableCollectionView.prototype.initialize = function(ModelView, Collection, tpl, options) {
      _.bindAll(this, 'render', 'unrender', 'fetchCollection', 'appendModel', 'hideLoading', 'showLoading', 'fetchCallback', '_setupDataTable', '_connectTableRowsToWugFeatures', 'showNothingFound', 'hideNothingFound');
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
      this.$('tbody').empty();
      params = _.extend({
        year: namespace.currYear
      }, this.fetchParams);
      this.trigger("table:startload");
      this.collection.fetch({
        data: params,
        success: function(collection) {
          var m, _i, _len, _ref;
          if (collection.models.length === 0) {
            _this.trigger("table:nothingfound");
          } else {
            _ref = collection.models;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              m = _ref[_i];
              _this.appendModel(m);
            }
            _this.$('.has-popover').popover({
              trigger: 'hover'
            });
            _this._setupDataTable();
            _this._connectTableRowsToWugFeatures();
            if ((_this.fetchCallback != null) && _.isFunction(_this.fetchCallback)) {
              _this.fetchCallback(collection.models);
            }
            _this.trigger("table:endload");
          }
        },
        error: function() {
          _this.trigger("table:fetcherror");
        }
      });
    };

    BaseTableCollectionView.prototype.fetchCallback = function(strategyModels) {
      var newWugList;
      newWugList = _.map(strategyModels, function(m) {
        return {
          id: m.get("recipientEntityId"),
          projectId: m.get("projectId"),
          name: m.get("recipientEntityName"),
          wktGeog: m.get("recipientEntityWktGeog"),
          sourceSupply: m.get("supply" + namespace.currYear),
          type: m.get("recipientEntityType"),
          stratTypeId: m.get("typeId")
        };
      });
      namespace.wugFeatureCollection.reset(newWugList);
    };

    BaseTableCollectionView.prototype._setupDataTable = function() {
      var $table, dtColConfig;
      $table = this.$('table');
      dtColConfig = [];
      $('th', $table).each(function(i, th) {
        var $th;
        $th = $(th);
        if ($th.attr('data-sort') != null) {
          return dtColConfig.push({
            sType: $(th).attr('data-sort')
          });
        } else {
          return dtColConfig.push(null);
        }
      });
      $table.dataTable({
        bDestroy: true,
        sPaginationType: "bootstrap",
        aLengthMenu: [[10, 25, 50, 100, 99999], [10, 25, 50, 100, "All"]],
        aoColumns: dtColConfig
      });
    };

    BaseTableCollectionView.prototype._connectTableRowsToWugFeatures = function() {
      var me;
      me = this;
      this.$('td.strategyType').hover(function(evt) {
        console.log("in", this);
      }, function(evt) {
        console.log("out", this);
      });
      this.$('table tbody').delegate('tr', 'hover', function(event) {
        var $target, projectId, wugId;
        if (event.type === 'mouseenter') {
          $target = $(this);
          wugId = parseInt($target.attr('data-entity-id'));
          projectId = parseInt($target.attr('data-project-id'));
          me.trigger("table:hoverwug", wugId, projectId);
        } else {
          me.trigger("table:hoverwug", null);
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
      $('#nothingFoundMessage').fadeIn();
      this.$el.hide();
    };

    BaseTableCollectionView.prototype.hideNothingFound = function() {
      $('#nothingFoundMessage').hide();
    };

    BaseTableCollectionView.prototype.showLoading = function() {
      this.$el.hide();
      this.hideNothingFound();
      $('.tableLoading').show();
    };

    BaseTableCollectionView.prototype.hideLoading = function() {
      $('.tableLoading').hide();
      this.$el.fadeIn();
    };

    return BaseTableCollectionView;

  })(Backbone.View);
});
