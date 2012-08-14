Ext.define('ISWP.controller.Map', {

    extend: 'Ext.app.Controller'

    views: [
        'map.MapComponent'
    ]

    stores: []

    refs: [
        {
            ref: 'mapComponent'
            selector: 'mapcomponent'
        }
    ]

    init: () ->
        this.control({
            'mapcomponent': 
                render: (mapComp) ->
                    mapComp.map = mapComp.initializeMap(mapComp.el.dom)
                    
                    return null
        })

})