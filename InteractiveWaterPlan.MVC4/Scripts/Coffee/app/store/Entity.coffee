Ext.define('ISWP.store.Entity', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.Entity'

    storeId: 'entityStore'

    autoLoad: false

    proxy:
        type: 'ajax'
        
        url: 'Feature/Entity/All'

        reader:
            type: 'json'

})