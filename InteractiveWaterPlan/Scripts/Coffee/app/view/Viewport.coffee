Ext.define('ISWP.view.Viewport', {
    extend: 'Ext.panel.Panel'

    layout: 'border'

    renderTo: 'appContainer'

    border: false
    height: 1400
    
    items: [
        {
            region: 'north'
            xtype: 'mapcomponent'
            height: 580
            id: 'mapContainer'
            
        }
        {
            region: 'center'
            xtype: 'panel'
            height: 500
            #layout: 'fit'
            
            items: [
                height: 300
                width: 300
                xtype: 'waterusechart'
                id: 'waterUseChart'
            ]
           

        }

    ]

})