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
            width: '100%'
            id: 'mapContainer'
            
        }

        {
            region: 'center'
            xtype: 'planyeartabpanel'
        }


        {
            region: 'south'
            html: 'south region'
            height: 220
            #border: false
        }

    ]

})

###
{
    #TODO: Perhaps change the center region to a tab
    # container.
    region: 'west'
    xtype: 'waterusechart'
    id: 'waterUseChart'

    width: 400
}
{
    region: 'center'
    html: 'center region'
    #border: false
}
###