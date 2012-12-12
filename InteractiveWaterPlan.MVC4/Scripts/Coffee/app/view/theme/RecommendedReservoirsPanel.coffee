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
                border: false
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
                    { text: "Name", width: 120, dataIndex: 'name', sortable: true, hideable: false, draggable: false, resizable: false }
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
                                        if rec.data.id == res_feat.data.id
                                            #found it - grab the bounds and zoom to it
                                            bounds = res_feat.geometry.getBounds()
                                            me.mapComp.map.zoomToExtent(bounds)
                                            break


                                    return null
                            }
                        ]
                    }
                ]
                bubbleEvents: ['itemdblclick']    
            })
        )
             
                
        return null
        

    listeners:
        afterrender: () ->
            return null

})