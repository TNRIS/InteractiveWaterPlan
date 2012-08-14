Ext.define('ISWP.view.Viewport', {
    extend: 'Ext.panel.Panel'

    
    renderTo: 'appContainer'

    border: false
    
    height: 1200
    width: '100%'
    
    layout: 'border'

    #TODO: Wrap everything in a Tab Panel to switch the themes?
    # Don't really want to create more than 1 Map...
    # so maybe best to nest themes in the center region?

    items: [
        {
            #TODO: Make some kind of "Zoom-To" control
            # Will need a method that generates the list with the extents
            
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