Ext.define("ISWP.view.theme.ExistingSupplyPanel", {
    
    extend: 'Ext.panel.Panel'
    alias: 'widget.existingsupplypanel'

    layout: 'border'

    wugStore: null
       
    initialize: () ->
        me = this
        topPanel = Ext.create('Ext.panel.Panel', 
        {
            region: 'north'
            height: 100
            html: """
                    <h3>Existing Supply</h3>
                    <p>Click on a dot to view the information for that water user group.</p>
                  """
        
            tbar: [
                
                "TEXAS &raquo; "
                
                {
                    xtype: 'combobox'
                    id: 'regionCombo'
                    store: 'RWP'
                    displayField: 'Name'
                    valueField: 'SqlId'
                    queryMode: 'local'
                    emptyText: 'Select a Planning Region'
                    editable: false
                    width: 200
                    listeners:
                        'select': (me, record) ->
                            console.log('Planning Region Selected', record[0])
                            Ext.getCmp('clearRegionBtn').enable()
                            return null
                        'change': (me, newVal, oldVal) ->
                            if newVal == ''
                                console.log('Planning Region cleared')
                            return null

                }
                {
                    xtype: 'button'
                    iconCls: 'icon-remove'
                    text: null
                    id: 'clearRegionBtn'
                    disabled: true
                    tooltip: 'Clear Region Selection'
                    handler: () ->
                        Ext.getCmp('regionCombo').select('')
                        this.disable()
                        return null
                }
                "&raquo; "
                {
                    xtype: 'combobox'
                    id: 'countyCombo'
                    store: 'County' #TODO: Modify store to get Counties IN RegionId
                    displayField: 'Name'
                    valueField: 'SqlId'
                    queryMode: 'local'
                    emptyText: 'Select a County'
                    editable: false
                    width: 200
                    listConfig:
                        #Group into 'Counties in Selected Planning Region' and 'All Counties'
                        tpl: [
                            '<ul class=\'x-grouped-combo\'>',
                                '<tpl for=".">',
                                '{[xindex === 1 || parent[xindex - 2].CategoryId !== values.CategoryId ? "<li class=\'x-boundlist-group\'>" + values.CategoryName + "</li>" : ""]}',
                                '<li role="option" class="x-boundlist-item">{Name}</li>',
                                '</tpl>',
                            '</ul>'
                        ]
                    
                }
                {
                    xtype: 'button'
                    iconCls: 'icon-remove'
                    text: null
                    id: 'clearCountyBtn'
                    disabled: true
                    tooltip: 'Clear County Selection'
                } 
            ]

           
        })
        
        me.add(topPanel)

        wugGrid = Ext.create('ISWP.view.theme.WUGGrid', {
            store: me.wugStore
            emptyText: "There are no Water User Groups in the selected area."
            region: 'center'
        })

        me.add(wugGrid)
        ###
        #TODO: Add Editors to comboboxes
        html: '<div id="textToEdit">Hi James</div>'

        listeners:
            afterrender: () ->
                editzor = Ext.create('Ext.Editor', {
                    updateEl: true
                    autoSize:
                        width: 'field'

                    field: 
                        xtype: 'combobox'
                        store: 'Entity'
                        displayField: 'Name'
                        valueField: 'Name'
                        queryMode: 'local'
                        editable: false
                        width: 200

                })

                Ext.get("textToEdit").on('dblclick', (e, t) ->
                    console.log(e, t)
                    editzor.startEdit(t)
                    return null
                )

                return null
        ###


        return null
})