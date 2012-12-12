Ext.define('ISWP.store.RWP', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.Place'

    storeId: 'rwpStore'

    autoLoad: true

    
    proxy:
        type: 'ajax'
        
        extraParams:
            'categoryId': 5

        url: "#{BASE_API_PATH}api/place"

        reader:
            type: 'json'

})