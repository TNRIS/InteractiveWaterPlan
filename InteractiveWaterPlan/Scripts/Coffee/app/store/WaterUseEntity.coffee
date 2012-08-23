Ext.define('ISWP.store.WaterUseEntity', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.WaterUseEntity'

    storeId: 'waterUseEntityStore'

    autoLoad: false

    proxy:
        type: 'parameterproxy'
        
        url: 'Data/Reservoir/Entity/{ReservoirId}/{Year}'

        reader:
            type: 'json'

})