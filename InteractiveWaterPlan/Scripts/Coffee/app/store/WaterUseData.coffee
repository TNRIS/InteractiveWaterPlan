Ext.define('ISWP.store.WaterUseData', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.WaterUseData'

    storeId: 'waterUseDataStore'

    autoLoad: false

    proxy:
        type: 'parameterproxy'
        
        url: 'Data/WaterUsage/{LocationType}/{LocationName}/{Year}'

        reader:
            type: 'json'

})