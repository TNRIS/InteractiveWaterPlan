Ext.define('ISWP.model.Theme', {
    
    extend: 'Ext.data.Model'

    #TODO: better field names
    fields: [
        'Name'
        {
            name: 'Layers'
            type: 'LayerInfo'
        }
        'ServiceUrl'
    ]
})