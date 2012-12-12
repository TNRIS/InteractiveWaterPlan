Ext.define('ISWP.store.Place', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.Place'

    storeId: 'placeStore'

    autoLoad: false

    proxy:
        type: 'ajax'
        
        url: "#{BASE_API_PATH}api/place"

        reader:
            type: 'json'

})