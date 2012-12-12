Ext.define('ISWP.view.theme.WUGGrid', {
    extend: 'Ext.grid.Panel'
    alias: 'widget.wuggrid'
    
    store: null

    emptyText: "No Water Use Groups found."
        
    viewConfig:
        deferEmptyText: false
    
    forceFit: true
    autoScroll: true
    
    columns: [
        { text: "Name", width: 120, dataIndex: "name", hideable: false, draggable: false, resizable: false}
        { text: "Supply (acre-feet/year)", width: 60, dataIndex: "sourceSupply", hideable: false, draggable: false, resizable: false}
        { text: "Planning Area", width: 50, dataIndex: "regionName", hideable: false, draggable: false, resizable: false}
        { text: "County", width: 60, dataIndex: "county", hideable: false, draggable: false, resizable: false}
        { text: "Basin", width: 50, dataIndex: "basin", hideable: false, draggable: false, resizable: false}

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
                    handler: (view, rowIndex, colIndex) ->
                        view.ownerCt.fireEvent("zoomtoclick", view, rowIndex)
                        return null
                }
            ]
        }
    ]
    bubbleEvents: ['itemdblclick', 'zoomtoclick']

    
})
        