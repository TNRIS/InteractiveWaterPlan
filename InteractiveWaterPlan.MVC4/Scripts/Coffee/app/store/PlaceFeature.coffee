Ext.define('ISWP.store.PlaceFeature', {
    
    extend: 'Ext.data.Store'

    fields: ['SqlId', 'Name', 'WKTGeog']

    storeId: 'placeFeatureStore'

    autoLoad: false

    proxy:
        type: 'parameterproxy'
        
        url: 'api/place/feature/{placeId}' #specify placeId as a parameter

        reader:
            type: 'json'

})