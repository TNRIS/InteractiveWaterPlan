// Generated by CoffeeScript 1.3.3
﻿;

var BASE_API_PATH, BASE_SCRIPT_PATH, console;

console = console || {};

console.log = console.log || function() {
  return null;
};

Ext.Ajax.defaultHeaders = {
  'Accept': 'application/json, application/xml',
  'Content-Type': 'application/json'
};

Ext.Loader.setConfig({
  enabled: true,
  disableCaching: true
});

BASE_SCRIPT_PATH = Ext.get("base_script_path").dom.value;

BASE_API_PATH = Ext.get("base_path").dom.value;

Ext.Loader.setPath('TNRIS', "" + BASE_SCRIPT_PATH + "/Compiled/TNRIS");

Ext.require('TNRIS.proxy.ParameterProxy');

Ext.require('TNRIS.theme.InteractiveTheme');

Ext.require('TNRIS.theme.ExistingSupplyTheme');

Ext.require('TNRIS.theme.RecommendedReservoirsTheme');

Ext.require('TNRIS.theme.StrategiesTheme');

Ext.create('Ext.app.Application', {
  name: 'ISWP',
  autoCreateViewport: true,
  appFolder: "" + BASE_SCRIPT_PATH + "/Compiled/app",
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
