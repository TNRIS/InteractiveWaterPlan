Ext.define('ISWP.store.WaterUseEntity', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.WaterUseEntity'

    storeId: 'waterUseEntityStore'

    autoLoad: false

    proxy:
        type: 'parameterproxy'
        
        url: 'api/feature/entity/{Year}'#?forReservoirId=ReservoirId

        reader:
            type: 'json'

})