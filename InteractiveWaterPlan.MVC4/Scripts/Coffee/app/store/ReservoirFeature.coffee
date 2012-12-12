Ext.define('ISWP.store.ReservoirFeature', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.ReservoirFeature'

    storeId: 'researvoirFeatureStore'

    autoLoad: false

    proxy:
        type: 'ajax'
        
        url: "#{BASE_API_PATH}api/feature/reservoir/recommended/all"

        reader:
            type: 'json'

})