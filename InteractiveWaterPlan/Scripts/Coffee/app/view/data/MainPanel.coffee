Ext.define("ISWP.view.data.MainPanel", {
    
    extend: 'Ext.panel.Panel'
    alias: 'widget.mainpanel'

    #rather than separate tabs
    layout: 
        type: 'hbox'
        align: 'stretch'

    tbar: [
        {
            text: 'Planning Year: '
        }
        {
            xtype: 'button'
            text: '2012'
            year: 2012
            pressed: true
            toggleGroup: 'yearButtons'
        }
        {
            xtype: 'button'
            text: '2020'
            year: 2020
            toggleGroup: 'yearButtons'
        }
        {
            xtype: 'button'
            text: '2030'
            year: 2030
            toggleGroup: 'yearButtons'
        }
        {
            xtype: 'button'
            text: '2040'
            year: 2040
            toggleGroup: 'yearButtons'
        }
        {
            xtype: 'button'
            text: '2050'
            year: 2050
            toggleGroup: 'yearButtons'
        }
        {
            xtype: 'button'
            text: '2060'
            year: 2060
            toggleGroup: 'yearButtons'
        }
    ]

    lbar: [
        {
            xtype: 'button'
            text: 'Water Usage'
            theme: 'theme-1'
            pressed: true
            toggleGroup: 'themeButtons'
        }
        {
            xtype: 'button'
            text: 'Theme 2'
            theme: 'theme-2'
            toggleGroup: 'themeButtons'
        }
        {
            xtype: 'button'
            text: 'Theme 3'
            theme: 'theme-3'
            toggleGroup: 'themeButtons'
        }
        {
            xtype: 'button'
            text: 'Theme 4'
            theme: 'theme-4'
            toggleGroup: 'themeButtons'
        }
        {
            xtype: 'button'
            text: 'Theme 5'
            theme: 'theme-5'
            toggleGroup: 'themeButtons'
        }

    ]


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