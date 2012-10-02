Ext.define('ISWP.store.Place', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.Place'

    storeId: 'placeStore'

    autoLoad: false

    proxy:
        type: 'ajax'
        
        url: 'api/place'

        reader:
            type: 'json'

})