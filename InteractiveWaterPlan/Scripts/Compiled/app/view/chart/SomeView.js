// Generated by CoffeeScript 1.3.3

Ext.define('ISWP.view.chart.SomeView', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.someview',
  layout: 'border',
  border: true,
  items: [
    {
      xtype: 'waterusechart',
      id: 'waterUseChart',
      region: 'west',
      width: 300
    }, {
      region: 'center',
      html: 'center here',
      height: 300
    }, {
      region: 'south',
      height: 300,
      html: 'south region'
    }
  ]
});
