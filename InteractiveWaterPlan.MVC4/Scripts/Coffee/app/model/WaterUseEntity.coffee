Ext.define('ISWP.model.WaterUseEntity', {

    extend: 'Ext.data.Model'

    fields: [
        'Id'
        'SqlId'
        'Name'
        'WktGeog'
        'Type'
        'RegionName'
        'County'
        'Basin'
        
        'SourceSupply'
        'IsRedundantSupply'
        'SourceName'
        'SourceId'
    ]

})