Ext.define('ISWP.model.WaterUseEntity', {

    extend: 'Ext.data.Model'

    fields: [
        'id'
        'sqlId'
        'name'
        'wktGeog'
        'type'
        'regionName'
        'county'
        'basin'
        
        'sourceSupply'
        'isRedundantSupply'
        'sourceName'
        'sourceId'
    ]

})