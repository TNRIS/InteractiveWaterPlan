Ext.define('ISWP.view.Viewport', {
    extend: 'Ext.container.Container'

    layout: 'border'

    renderTo: 'appContainer'

    border: false

    items: [
        {
            region: 'north'
            xtype: 'mapcomponent'
            height: 500
            id: 'mapContainer'
            
        }
        {
            region: 'center'
            html: 'All the charts and cool stuff go here'
        }

    ]

})