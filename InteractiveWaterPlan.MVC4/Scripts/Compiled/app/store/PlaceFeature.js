// Generated by CoffeeScript 1.3.3

Ext.define('ISWP.store.PlaceFeature', {
  extend: 'Ext.data.Store',
  fields: ['WKTGeog'],
  storeId: 'placeFeatureStore',
  autoLoad: false,
  proxy: {
    type: 'ajax',
    url: 'api/place/feature',
    reader: {
      type: 'json'
    }
  }
});
