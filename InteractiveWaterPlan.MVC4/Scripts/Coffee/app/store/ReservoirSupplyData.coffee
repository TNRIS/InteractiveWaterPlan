Ext.define('ISWP.store.ReservoirSupplyData', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.ReservoirSupplyData'

    storeId: 'reservoirSupplyData'

    autoLoad: false

    proxy:
        type: 'parameterproxy'
        
        url: 'api/data/reservoir/{ReservoirId}/{Year}'

        reader:
            type: 'json'

})