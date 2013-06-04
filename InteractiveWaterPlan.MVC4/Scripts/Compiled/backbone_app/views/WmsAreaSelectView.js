var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['namespace', 'scripts/text!templates/wmsAreaSelect.html'], function(namespace, tpl) {
  var WmsAreaSelectView, _ref;
  return WmsAreaSelectView = (function(_super) {
    __extends(WmsAreaSelectView, _super);

    function WmsAreaSelectView() {
      _ref = WmsAreaSelectView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    WmsAreaSelectView.prototype.template = _.template(tpl);

    WmsAreaSelectView.prototype.initialize = function(options) {
      _.bindAll(this, 'render', 'unrender', '_createRegionSelect', '_createCountySelect', '_createHouseSenateSelect', '_createWugSelect', 'enableSelects', 'disableSelects', 'resetSelects');
      if ((namespace.countyNames == null) || (namespace.regionNames == null) || (namespace.houseNames == null) || (namespace.senateNames == null)) {
        throw "Must specify namespace.counties, namespace.regions, namespace.house,and namespace.senate";
      }
    };

    WmsAreaSelectView.prototype.render = function() {
      this.$el.empty();
      this.$el.html(this.template());
      this.selects = {};
      this.selects["region"] = this._createRegionSelect().chosen();
      this.selects["county"] = this._createCountySelect().chosen();
      this.selects["wug"] = this._createWugSelect().ajaxChosen({
        type: 'GET',
        url: "" + BASE_PATH + "api/entities/auto",
        jsonTermKey: "namePart"
      }, function(data) {
        var kvp, results, _i, _len;
        results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          kvp = data[_i];
          results.push({
            value: kvp.id,
            text: kvp.name
          });
        }
        return results;
      });
      return this;
    };

    WmsAreaSelectView.prototype.resetSelects = function(exceptName) {
      var select;
      for (select in this.selects) {
        if (select !== exceptName) {
          this.selects[select].val("-1").trigger("liszt:updated");
        }
      }
    };

    WmsAreaSelectView.prototype.disableSelects = function() {
      var select;
      for (select in this.selects) {
        this.selects[select].attr('disabled', true).trigger("liszt:updated");
      }
    };

    WmsAreaSelectView.prototype.enableSelects = function() {
      var select;
      for (select in this.selects) {
        this.selects[select].attr('disabled', null).trigger("liszt:updated");
      }
    };

    WmsAreaSelectView.prototype._createRegionSelect = function() {
      var $regionSelect, me, opt, region, _i, _len, _ref1;
      $regionSelect = $("<select></select>");
      $regionSelect.append($("<option value='-1'>Select a Region</option>"));
      _ref1 = namespace.regionNames.models;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        region = _ref1[_i];
        opt = $("<option value='" + (region.get("letter")) + "'>Region " + (region.get("letter")) + "</option>");
        $regionSelect.append(opt);
      }
      this.$("#regionSelectContainer").append($regionSelect);
      me = this;
      $regionSelect.on("change", function() {
        var $this;
        $this = $(this);
        if ($this.val() === "-1") {
          return;
        }
        Backbone.history.navigate("#/" + namespace.currYear + "/wms/region/" + ($this.val()), {
          trigger: true
        });
        me.resetSelects("region");
      });
      return $regionSelect;
    };

    WmsAreaSelectView.prototype._createCountySelect = function() {
      var $countySelect, county, me, opt, _i, _len, _ref1;
      $countySelect = $("<select></select>");
      $countySelect.append($("<option value='-1'>Select a County</option>"));
      _ref1 = namespace.countyNames.models;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        county = _ref1[_i];
        opt = $("<option value='" + (county.get("id")) + "'>" + (county.get("name")) + "</option>");
        $countySelect.append(opt);
      }
      this.$("#countySelectContainer").append($countySelect);
      me = this;
      $countySelect.on("change", function() {
        var $this;
        $this = $(this);
        if ($this.val() === "-1") {
          return;
        }
        Backbone.history.navigate("#/" + namespace.currYear + "/wms/county/" + ($this.val()), {
          trigger: true
        });
        me.resetSelects("county");
      });
      return $countySelect;
    };

    WmsAreaSelectView.prototype._createHouseSenateSelect = function() {
      var $houseSenateSelect, district, me, opt, _i, _j, _len, _len1, _ref1, _ref2;
      $houseSenateSelect = $("<select></select>");
      $houseSenateSelect.append($("<option value='-1'>Select a Legislative District</option>"));
      _ref1 = namespace.senateNames.models;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        district = _ref1[_i];
        opt = $("<option data-type='senate' value='" + (district.get("id")) + "'>" + (district.get("name")) + "</option>");
        $houseSenateSelect.append(opt);
      }
      _ref2 = namespace.houseNames.models;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        district = _ref2[_j];
        opt = $("<option data-type='house' value='" + (district.get("id")) + "'>" + (district.get("name")) + "</option>");
        $houseSenateSelect.append(opt);
      }
      this.$("#districtSelectContainer").append($houseSenateSelect);
      me = this;
      $houseSenateSelect.on("change", function() {
        var $selectedOption, $this, districtType;
        $this = $(this);
        if ($this.val() === "-1") {
          return;
        }
        $selectedOption = $this.find(":selected");
        districtType = $selectedOption.attr('data-type');
        if (districtType === 'senate') {
          Backbone.history.navigate("#/" + namespace.currYear + "/wms/senate/" + ($this.val()), {
            trigger: true
          });
        } else {
          Backbone.history.navigate("#/" + namespace.currYear + "/wms/house/" + ($this.val()), {
            trigger: true
          });
        }
        me.resetSelects("district");
      });
      return $houseSenateSelect;
    };

    WmsAreaSelectView.prototype._createWugSelect = function() {
      var $wugSelect, me;
      $wugSelect = $("<select></select>");
      $wugSelect.append($("<option value='-1'>Search for a Water User Group</option>"));
      this.$("#wugSelectContainer").append($wugSelect);
      me = this;
      $wugSelect.on("change", function() {
        var $this;
        $this = $(this);
        if ($this.val() === "-1") {
          return;
        }
        Backbone.history.navigate("#/" + namespace.currYear + "/wms/entity/" + ($this.val()), {
          trigger: true
        });
        me.resetSelects("wug");
      });
      return $wugSelect;
    };

    WmsAreaSelectView.prototype.unrender = function() {
      this.$el.remove();
      return null;
    };

    return WmsAreaSelectView;

  })(Backbone.View);
});
