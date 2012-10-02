Ext.define('ISWP.store.RWP', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.Place'

    storeId: 'rwpStore'

    autoLoad: true

    
    proxy:
        type: 'ajax'
        
        extraParams:
            'category': 5

        url: 'api/place'

        reader:
            type: 'json'

})