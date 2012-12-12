Ext.define('ISWP.store.Entity', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.Entity'

    storeId: 'entityStore'

    autoLoad: false

    proxy:
        type: 'ajax'
        
        url: "#{BASE_API_PATH}api/feature/entity/all"

        reader:
            type: 'json'

})