Ext.define('ISWP.store.PlaceFeature', {
    
    extend: 'Ext.data.Store'

    fields: ['SqlId', 'Name', 'WKTGeog']

    storeId: 'placeFeatureStore'

    autoLoad: false

    proxy:
        type: 'ajax'
        
        url: 'api/place/feature' #specify placeId as a parameter

        reader:
            type: 'json'

})