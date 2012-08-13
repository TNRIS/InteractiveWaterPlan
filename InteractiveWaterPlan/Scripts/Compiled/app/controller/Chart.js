// Generated by CoffeeScript 1.3.3

Ext.define('ISWP.controller.Chart', {
  extend: 'Ext.app.Controller',
  views: ['chart.WaterUseChart'],
  stores: ['WaterUseData'],
  refs: [
    {
      ref: 'waterUseChart',
      selector: '#waterUseChart'
    }
  ],
  init: function() {
    return this.control({
      'waterusechart': {
        render: function(chart) {
          return null;
        }
      }
    });
  }
});
