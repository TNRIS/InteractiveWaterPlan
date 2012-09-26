// Generated by CoffeeScript 1.3.3

Ext.define('ISWP.store.ReservoirSupplyData', {
  extend: 'Ext.data.Store',
  model: 'ISWP.model.WaterSourceSupplyData',
  storeId: 'reservoirSupplyData',
  autoLoad: false,
  proxy: {
    type: 'parameterproxy',
    url: 'api/data/reservoir/{ReservoirId}/{Year}',
    reader: {
      type: 'json'
    }
  }
});