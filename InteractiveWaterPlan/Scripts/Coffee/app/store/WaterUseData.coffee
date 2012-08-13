Ext.define('ISWP.store.WaterUseData', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.WaterUseData'

    storeId: 'waterUseDataStore'

    #autoLoad: false

    #TODO: Get the data from an ajax service
    data: [
        {
            Name: 'Agriculture'
            Value: 500
        }
        {
            Name: 'Municipal'
            Value: 300
        }
        {
            Name: 'Power'
            Value: 150
        }
        {
            Name: 'Livestock'
            Value: 80
        }
        {
            Name: 'Industrial'
            Value: 200
        }
    ]
})