Ext.define("ISWP.view.data.MainPanel", {
    
    extend: 'Ext.panel.Panel'
    alias: 'widget.mainpanel'

    #rather than separate tabs
    layout: 
        type: 'hbox'
        align: 'stretch'

    items: [
        {
            flex: 1
            xtype: 'waterusechart'
            id: 'mainChart'

        }
        {
            flex: 2
            html: 'Main content for 2012'
            id: 'mainContent'
            border: false
        }
    ]

})