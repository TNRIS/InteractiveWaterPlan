Ext.define('ISWP.view.Viewport', {
    extend: 'Ext.panel.Panel'

    
    renderTo: 'appContainer'

    border: false
    
    height: 1200
    width: '100%'
    
    layout: 'border'

    items: [
        {
            region: 'north'
            xtype: 'mapcomponent'
            height: 580
            id: 'mapContainer'
            
        }
        {
            region: 'west'
            xtype: 'waterusechart'
            id: 'waterUseChart'

            width: 300
        }
        {
            region: 'center'
            html: 'center region'
            #border: false
        }
        {
            region: 'south'
            html: 'south region'
            height: 320
            #border: false
        }

    ]

})