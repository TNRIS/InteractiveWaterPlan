Ext.define('ISWP.store.WaterUseData', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.WaterSourceSupplyData'

    storeId: 'waterUseDataStore'

    autoLoad: false

    proxy:
        type: 'parameterproxy'
        
        url: "#{BASE_API_PATH}api/data/wateruse/{LocationType}/{LocationName}/{Year}"

        reader:
            type: 'json'

})