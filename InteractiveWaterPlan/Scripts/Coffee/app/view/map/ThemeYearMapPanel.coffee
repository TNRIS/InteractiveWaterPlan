Ext.define('ISWP.view.map.ThemeYearMapPanel', {
    
    extend: 'Ext.panel.Panel'
    alias: 'widget.themeyearmappanel'

    layout: 'fit'
    
    tbar: [
        
        'Planning Year: '
        
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
        '-' #separator
        '->' #align the rest to the right
        {
            #TODO: textbox?
            xtype: 'combobox'
            hideLabel: true
            #typeAhead: true
            #store: 'entitiesStore'
            emptyText: 'Enter a Location Name'
            width: 200
        }
    ]

    lbar: [
        {
            xtype: 'button'
            text: 'Water Usage'
            theme: 'water-usage'
            size: 'large'
            pressed: true
            toggleGroup: 'themeButtons'
        }
        {
            xtype: 'button'
            text: 'Proposed Reservoirs'
            theme: 'proposed-reservoirs'
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
            xtype: 'mapcomponent'
            id: 'mapContainer'
        }
    ]


})