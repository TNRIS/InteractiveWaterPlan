Ext.define('ISWP.model.WaterUseEntity', {

    extend: 'Ext.data.Model'

    fields: [
        'Id'
        'SqlId'
        'Name'
        'WKTGeog'
        'Type'
        'RWP'
        'County'
        'Basin'
        
        'SourceSupply'
        'IsRedundantSupply'
        'SourceName'
        'SourceId'
    ]

})