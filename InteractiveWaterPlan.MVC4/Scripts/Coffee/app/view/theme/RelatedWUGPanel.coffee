Ext.define("ISWP.view.theme.RelatedWUGPanel", {
    
    extend: 'Ext.panel.Panel'
    alias: 'widget.relatedwugpanel'

    layout: 'border'

    supplyStore: null
    relatedWUGStore: null
    relatedWUGLayer: null
    curr_reservoir: null
    mapComp: null
       
    initialize: () ->
        me = this
        me.add(Ext.create('Ext.panel.Panel', {
                region: 'north'
                height: 60
                html:   """
                        <h3>#{me.curr_reservoir.data.Name}</h3>
                        <p>Descriptive text. Clear Selection button. Animate button.</p>
                        """
            })
        )

        me.add(Ext.create('ISWP.view.chart.WaterUseChart', {
                store: me.supplyStore
                region: 'south'
                height: 300
                margin: 5
            })
        )

        me.add(Ext.create('Ext.grid.Panel', {
                store: me.relatedWUGStore
                emptyText: "There are no related water user groups for the chosen reservoir and decade. Try selecting a different planning decade."
                    
                viewConfig:
                    deferEmptyText: false
                
                forceFit: true
                autoScroll: true
                region: 'center'

                columns: [
                    { text: "Name", width: 120, dataIndex: "Name", hideable: false, draggable: false, resizable: false}
                    { text: "Supply (acre-feet/year)", width: 60, dataIndex: "SourceSupply", hideable: false, draggable: false, resizable: false}
                    { text: "Planning Area", width: 50, dataIndex: "RWP", hideable: false, draggable: false, resizable: false}
                    { text: "County", width: 60, dataIndex: "County", hideable: false, draggable: false, resizable: false}
                    { text: "Basin", width: 50, dataIndex: "Basin", hideable: false, draggable: false, resizable: false}

                    {
                        xtype: 'actioncolumn'
                        width: 10
                        resizable: false
                        sortable: false
                        hideable: false
                        draggable: false
                        items: [
                            {
                                iconCls: 'icon-zoom-in'
                                tooltip: 'Zoom To'
                                handler: (grid, rowIndex, colIndex) =>
                                    me.fireEvent("zoomtoclick", grid, rowIndex)
                                    return null
                            }
                        ]
                    }
                ]
                bubbleEvents: ['itemdblclick']
                
            })
        )

        return null

        ###
        #Create a double-click listener to highlight the associated feature
        relatedEntitiesGridPanel.on('itemdblclick', (grid, record) =>
            
            #unselect the previous WUG
            this.selectWUGControl.unselectAll()

            #find the matching WUG in the feature layer
            for wug_feat in this.relatedWUGLayer.features
                if record.data.Id == wug_feat.data.Id
                    #found it - selectthe matching WUG feature
                    this.selectWUGControl.select(wug_feat)
                    break  

            return null
        )
        ###
})