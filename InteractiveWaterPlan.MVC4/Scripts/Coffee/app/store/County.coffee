Ext.define('ISWP.store.County', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.Place'

    storeId: 'countyStore'

    autoLoad: true

    proxy:
        type: 'ajax'
        
        #extraParams:
        #    'category': 1 

        url: 'api/place/all'

        reader:
            type: 'json'

})