###
The ThemeYearMapPanel is a Panel that holds a MapComponent and
 the toolbars for controlling the current data view of the application.
###
Ext.define('ISWP.view.map.ThemeYearMapPanel', {
    
    extend: 'Ext.panel.Panel'
    alias: 'widget.themeyearmappanel'

    layout: 'fit'
    items: [
        {
            xtype: 'mapcomponent'
            id: 'mapComponent'
        }
    ]

    dockedItems: [
        {
            xtype: 'toolbar'
            dock: 'bottom'
            id: 'yearButtonBar'
            items: [

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
                    xtype: 'button'
                    text: 'Zoom to Texas'
                    id: 'resetExtentButton'
                }
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
        }


        {
            xtype: 'toolbar'
            dock: 'left'
            id: 'themeButtonBar'
            items: [
                {
                    xtype: 'button'
                    text: 'Water Use'
                    theme: 'water-use'
                    #pressed: true
                    toggleGroup: 'themeButtons'
                }
                {
                    xtype: 'button'
                    text: 'Proposed Reservoirs'
                    theme: 'proposed-reservoirs'
                    pressed: true
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
        }

        
    ]

    getSelectedTheme: () ->
        selectedTheme = null
        this.dockedItems.getByKey('themeButtonBar').items.each((item) ->
            if item.xtype == 'button' and item.pressed
                selectedTheme = item.theme
                return false #stops the iteration since we have found a pressed button
        )
        return selectedTheme

    getSelectedYear: () ->
        selectedYear = null
        this.dockedItems.getByKey('yearButtonBar').items.each((item) ->
            if item.xtype == 'button' and item.pressed
                selectedYear = item.year
                return false #stops the iteration since we have found a pressed button
        )
        return selectedYear


})