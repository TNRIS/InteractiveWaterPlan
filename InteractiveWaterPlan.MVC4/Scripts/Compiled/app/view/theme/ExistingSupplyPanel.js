// Generated by CoffeeScript 1.3.3

Ext.define("ISWP.view.theme.ExistingSupplyPanel", {
  extend: 'Ext.panel.Panel',
  alias: 'widget.existingsupplypanel',
  layout: 'border',
  initialize: function() {
    var me;
    me = this;
    me.add(Ext.create('Ext.panel.Panel', {
      region: 'center',
      html: "<h3>Existing Supply</h3>\n<p>Click on a dot to view the information for that water user group.</p>"
    }));
    return null;
  }
});
