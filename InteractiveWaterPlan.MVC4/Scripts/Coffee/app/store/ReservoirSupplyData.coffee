Ext.define('ISWP.store.ReservoirSupplyData', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.WaterSourceSupplyData'

    storeId: 'reservoirSupplyData'

    autoLoad: false

    proxy:
        type: 'parameterproxy'
        
        url: "#{BASE_API_PATH}api/data/reservoir/{ReservoirId}/{Year}"

        reader:
            type: 'json'

})