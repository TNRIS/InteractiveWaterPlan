Ext.define('ISWP.store.WaterUseData', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.WaterSourceSupplyData'

    storeId: 'waterUseDataStore'

    autoLoad: false

    proxy:
        type: 'parameterproxy'
        
        url: 'api/data/wateruse/{LocationType}/{LocationName}/{Year}'

        reader:
            type: 'json'

})