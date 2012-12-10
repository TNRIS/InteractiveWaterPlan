// Generated by CoffeeScript 1.3.3
﻿;

var console;

try {
  console.log("Console is defined");
} catch (e) {
  console = {};
  console.log = function() {
    return null;
  };
}

Ext.Ajax.defaultHeaders = {
  'Accept': 'application/json, application/xml',
  'Content-Type': 'application/json'
};

Ext.Loader.setConfig({
  enabled: true,
  disableCaching: true
});

Ext.Loader.setPath('TNRIS', "" + (Ext.get("scripts_path").dom.value) + "/Compiled/TNRIS");

Ext.require('TNRIS.proxy.ParameterProxy');

Ext.require('TNRIS.theme.InteractiveTheme');

Ext.require('TNRIS.theme.ExistingSupplyTheme');

Ext.require('TNRIS.theme.RecommendedReservoirsTheme');

Ext.require('TNRIS.theme.StrategiesTheme');

Ext.create('Ext.app.Application', {
  name: 'ISWP',
  autoCreateViewport: true,
  appFolder: "" + (Ext.get("scripts_path").dom.value) + "/Compiled/app",
  controllers: ['Main']
});

Ext.define("Ext.view.AbstractView.LoadMask", {
  override: "Ext.view.AbstractView",
  onRender: function() {
    this.callParent();
    if (this.loadMask && Ext.isObject(this.store)) {
      this.setMaskBind(this.store);
    }
    return null;
  }
});
