Ext.define('ISWP.store.County', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.Place'

    storeId: 'countyStore'

    autoLoad: true

    proxy:
        type: 'ajax'
        
        #extraParams:
        #    'categoryId': 1 

        url: "#{BASE_API_PATH}api/place/all"

        reader:
            type: 'json'

})