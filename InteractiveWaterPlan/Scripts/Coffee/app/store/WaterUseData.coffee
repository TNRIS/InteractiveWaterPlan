Ext.define('ISWP.store.WaterUseData', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.WaterUseData'

    storeId: 'waterUseDataStore'

    #autoLoad: false

    #TODO: Get the data from an ajax service
    data: [
        {
            Name: 'Municipal'
            Value: 4851201
        }
        {
            Name: 'Irrigation'
            Value: 10079215
        }
        {
            Name: 'Manufacturing'
            Value: 1727808
        }
        {
            Name: 'Mining'
            Value: 296230
        }
        {
            Name: 'Steam-electric'
            Value: 733179
        }
        {
            Name: 'Livestock'
            Value: 322966
        }
        
    ]
})