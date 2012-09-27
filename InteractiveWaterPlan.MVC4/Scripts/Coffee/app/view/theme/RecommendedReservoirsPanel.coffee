Ext.define("ISWP.view.theme.RecommendedReservoirsPanel", {
    
    extend: 'Ext.panel.Panel'
    alias: 'widget.recrespanel'

    layout: 'border'
       
    reservoirStore: null
    reservoirLayer: null
    mapComp: null

    initialize: () ->
        me = this
   
        me.add(
            Ext.create('Ext.panel.Panel', {
                height: 60
                region: 'north'
                html:   """
                        <h3>Recommended Reservoirs</h3>
                        <p>Select a reservoir by clicking on one in the map or double-clicking a name below to see the water user groups that will benefit from its supply.</p>
                        """
            })
        )

        me.add(
            Ext.create('Ext.grid.Panel', {
                xtype: 'gridpanel'
                forceFit: true
                autoScroll: true
                region: 'center'
                store: me.reservoirStore
                columns: [
                    { text: "Name", width: 120, dataIndex: 'Name', sortable: true, hideable: false, draggable: false, resizable: false }
                    {
                        xtype: 'actioncolumn'
                        width: 6
                        resizable: false
                        sortable: false
                        hideable: false
                        draggable: false
                        items: [
                            {
                                iconCls: 'icon-zoom-in'
                                tooltip: 'Zoom To'
                                handler: (grid, rowIndex, colIndex) ->
                                    #Zoom to the feature when the action is clicked
                                    rec = grid.getStore().getAt(rowIndex)

                                    #find the matching reservoir in the feature layer
                                    for res_feat in me.reservoirLayer.features
                                        if rec.data.Id == res_feat.data.Id
                                            #found it - grab the bounds and zoom to it
                                            bounds = res_feat.geometry.getBounds()
                                            me.mapComp.map.zoomToExtent(bounds)
                                            break

                                   
                                    return null
                            }
                        ]
                    }
                ]
                listeners:
                    itemdblclick: (grid, record) ->
                        me.fireEvent("itemdblclick", grid, record)
                        return null       
            })
        )
             
                
        return null
        

    listeners:
        afterrender: () ->
            return null

###
        reservoirGridPanel = Ext.create('Ext.grid.Panel', {
            store: this.reservoirStore,
            columns: [
                { text: "Name", width: 120, dataIndex: 'Name', sortable: true, hideable: false, draggable: false, resizable: false }
                {
                    xtype: 'actioncolumn'
                    width: 6
                    resizable: false
                    sortable: false
                    hideable: false
                    draggable: false
                    items: [
                        {
                            iconCls: 'icon-zoom-in'
                            tooltip: 'Zoom To'
                            handler: (grid, rowIndex, colIndex) =>
                                #Zoom to the feature when the action is clicked
                                rec = grid.getStore().getAt(rowIndex)

                                #find the matching reservoir in the feature layer
                                for res_feat in this.reservoirLayer.features
                                    if rec.data.Id == res_feat.data.Id
                                        #found it - grab the bounds and zoom to it
                                        bounds = res_feat.geometry.getBounds()
                                        this.mapComp.map.zoomToExtent(bounds)
                                        break

                               
                                return null
                        }
                    ]
                }
            ],
            forceFit: true
            autoScroll: true
            region: 'center'
        });

        reservoirGridPanel.on('itemdblclick', (grid, record) =>
            
            #unselect the previous reservoir
            this.selectReservoirControl.unselectAll()

            #find the matching reservoir in the feature layer
            for res_feat in this.reservoirLayer.features
                if record.data.Id == res_feat.data.Id
                    #found it - set curr_reservoir to the matching feature
                    this.curr_reservoir = res_feat
                    break

            #select the reservoir
            this.selectReservoirControl.select(this.curr_reservoir)

            return null
        )
###

})