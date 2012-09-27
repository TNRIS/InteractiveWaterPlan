Ext.define('ISWP.store.ReservoirFeature', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.ReservoirFeature'

    storeId: 'researvoirFeatureStore'

    autoLoad: false

    proxy:
        type: 'ajax'
        
        url: 'api/feature/reservoir/recommended/all'

        reader:
            type: 'json'

})