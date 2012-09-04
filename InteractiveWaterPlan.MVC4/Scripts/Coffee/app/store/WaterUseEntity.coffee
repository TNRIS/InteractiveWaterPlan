Ext.define('ISWP.store.WaterUseEntity', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.WaterUseEntity'

    storeId: 'waterUseEntityStore'

    autoLoad: false

    proxy:
        type: 'parameterproxy'
        
        #?forReservoirId=ReservoirId
        url: 'api/feature/entity/{Year}'

        reader:
            type: 'json'

})