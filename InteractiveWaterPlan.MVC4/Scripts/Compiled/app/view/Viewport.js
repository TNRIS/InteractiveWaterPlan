// Generated by CoffeeScript 1.3.3

Ext.define('ISWP.view.Viewport', {
  extend: 'Ext.panel.Panel',
  renderTo: 'appContainer',
  border: false,
  height: 1400,
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
      xtype: 'maincontainer',
      id: 'mainContainer'
    }, {
      region: 'south',
      html: 'Prepared by <a href="http://www.tnris.org">TNRIS</a>',
      height: 40,
      bodyCls: 'app-footer'
    }
  ]
});
