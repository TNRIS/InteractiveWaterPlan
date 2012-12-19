Ext.define('ISWP.store.PlaceFeature', {
    
    extend: 'Ext.data.Store'

    fields: ['id', 'name', 'wktGeog']

    storeId: 'placeFeatureStore'

    autoLoad: false

    proxy:
        type: 'parameterproxy'
        
        url: "#{BASE_API_PATH}api/place/feature/{placeId}" #specify placeId as a parameter

        reader:
            type: 'json'

})