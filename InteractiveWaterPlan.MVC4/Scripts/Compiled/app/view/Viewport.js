// Generated by CoffeeScript 1.3.3

Ext.define('ISWP.view.Viewport', {
  extend: 'Ext.panel.Panel',
  renderTo: 'appContainer',
  border: false,
  height: 1200,
  width: '100%',
  layout: 'border',
  items: [
    {
      region: 'north',
      xtype: 'themeyearmappanel',
      height: 600,
      width: '100%',
      id: 'themeYearMapPanel'
    }, {
      region: 'center',
      xtype: 'mainpanel',
      id: 'mainPanel'
    }, {
      region: 'south',
      html: 'south region',
      height: 220
    }
  ]
});
