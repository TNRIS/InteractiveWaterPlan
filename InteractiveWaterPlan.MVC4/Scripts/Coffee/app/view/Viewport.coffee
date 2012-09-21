Ext.define('ISWP.view.Viewport', {
    extend: 'Ext.panel.Panel'

    renderTo: 'appContainer' #id of div into which this application will be rendered

    border: false
    
    height: 1200
    width: '100%'
    
    layout: 'border'

    items: [
        {
            #TODO: Make some kind of "Zoom-To" control
            # Will need a method that generates the list with the extents
            
            region: 'north'
            xtype: 'themeyearmappanel'
            height: 600
            width: '100%'
            id: 'themeYearMapPanel'  

        }

        {
            region: 'center'
            xtype: 'mainpanel'
            id: 'mainPanel'
        }


        {
            region: 'south'
            html: 'south region'
            height: 50
            #border: false
        }

    ]

})
