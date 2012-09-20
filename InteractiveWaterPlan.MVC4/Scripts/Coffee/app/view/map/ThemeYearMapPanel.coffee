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

                'Planning Decade: '
                
                {
                    xtype: 'button'
                    text: '2010'
                    year: 2010
                    pressed: true
                    allowDepress: false
                    toggleGroup: 'yearButtons'
                }
                {
                    xtype: 'button'
                    text: '2020'
                    year: 2020
                    allowDepress: false
                    toggleGroup: 'yearButtons'
                }
                {
                    xtype: 'button'
                    text: '2030'
                    year: 2030
                    allowDepress: false
                    toggleGroup: 'yearButtons'
                }
                {
                    xtype: 'button'
                    text: '2040'
                    year: 2040
                    allowDepress: false
                    toggleGroup: 'yearButtons'
                }
                {
                    xtype: 'button'
                    text: '2050'
                    year: 2050
                    allowDepress: false
                    toggleGroup: 'yearButtons'
                }
                {
                    xtype: 'button'
                    text: '2060'
                    year: 2060
                    allowDepress: false
                    toggleGroup: 'yearButtons'
                }
                # TODO: animate the proposed reservoirs theme
                #   Might be better to put this button somewhere else though
                {
                    xtype: 'button'
                    text: 'Animate'
                    iconCls: 'icon-play'
                    iconAlign: 'right'
                }
                '->' #align the rest to the right
                {
                    xtype: 'button'
                    text: 'Zoom to Texas'
                    id: 'resetExtentButton'
                    iconCls: 'icon-fullscreen'
                }
                '-' #separator

                {
                    xtype: 'combobox'
                    id: 'placeCombo'
                    typeAhead: true
                    store: 'Place'
                    queryMode: 'remote'
                    queryCaching: true
                    queryParam: 'name'
                    queryDelay: 200
                    typeAheadDelay: 200
                    minChars: 2
                    hideTrigger: true
                    valueField: 'SqlId'
                    displayField: 'Name'
                    emptyText: 'Go to Location'
                    width: 240
                    listConfig: {
                        getInnerTpl: () ->
                            return '<div data-qtip="{Name} ({CategoryName})">{Name} <span class="catName">{CategoryName}</span></div>'
                    }
                }
                {
                    xtype: 'button'
                    iconCls: 'icon-remove'
                    text: null
                    id: 'clearPlaceButton'
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
                    text: 'Existing<br/>Supply'
                    theme: 'water-use'
                    #pressed: true
                    allowDepress: false
                    toggleGroup: 'themeButtons'
                }
                {
                    xtype: 'button'
                    text: 'Recommended<br/>Reservoirs'
                    theme: 'proposed-reservoirs'
                    pressed: true
                    allowDepress: false
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