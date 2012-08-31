Ext.define('ISWP.store.WaterUseEntity', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.WaterUseEntity'

    storeId: 'waterUseEntityStore'

    autoLoad: false

    proxy:
        type: 'parameterproxy'
        
        #?forReservoirId=ReservoirId
        url: 'Feature/Entity/{Year}'

        reader:
            type: 'json'

})