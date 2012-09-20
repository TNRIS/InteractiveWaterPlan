Ext.define('ISWP.store.Place', {
    
    extend: 'Ext.data.Store'

    fields: ['SqlId', 'Name', 'CategoryName']

    storeId: 'placeStore'

    autoLoad: false

    proxy:
        type: 'ajax'
        
        url: 'api/place'

        reader:
            type: 'json'

})