Ext.define('ISWP.view.Viewport', {
    extend: 'Ext.panel.Panel'

    renderTo: 'appContainer' #id of div into which this application will be rendered

    border: false
    
    height: 1400
    width: '100%'
    
    layout: 'border'

    items: [
        {
            region: 'north'
            xtype: 'themeyearmappanel'
            height: 630
            width: '100%'
            id: 'themeYearMapPanel'  
        }

        {
            region: 'center'
            xtype: 'maincontainer'
            id: 'mainContainer'
        }

        {
            region: 'south'
            html: 'Prepared by <a href="http://www.tnris.org">TNRIS</a>'
            height: 40
            bodyCls: 'app-footer'
            #border: false
        }

    ]

})
