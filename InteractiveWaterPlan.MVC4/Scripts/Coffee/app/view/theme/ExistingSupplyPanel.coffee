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
        
            #TODO: maybe a WUG autocomplete so they can be found by name if already known

            tbar: [
                
                "TEXAS &raquo; "
                
                {
                    xtype: 'combobox'
                    id: 'regionCombo'
                    store: 'RWP'
                    displayField: 'name'
                    valueField: 'sqlId'
                    queryMode: 'local'
                    emptyText: 'Select a Planning Region'
                    editable: false
                    width: 200
                    listeners:
                        'select': (me, record) =>
                            this.fireEvent('regionselect', record[0].data)
                            Ext.getCmp('clearRegionBtn').enable()
                            return null
                        

                }
                {
                    xtype: 'button'
                    iconCls: 'icon-remove'
                    text: null
                    id: 'clearRegionBtn'
                    disabled: true
                    tooltip: 'Clear Region Selection'
                    handler: (me) =>
                        this.fireEvent('regionclear')
                        Ext.getCmp('regionCombo').select('')
                        me.disable()
                        return null
                }
                "&raquo; "
                {
                    xtype: 'combobox'
                    id: 'countyCombo'
                    store: 'County' #TODO: Modify store to get Counties IN RegionId
                    displayField: 'name'
                    valueField: 'sqlId'
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
                    listeners:
                        'select': (me, record) =>
                            this.fireEvent('countyselect', record[0].data)
                            Ext.getCmp('clearCountyBtn').enable()
                            return null
                }
                {
                    xtype: 'button'
                    iconCls: 'icon-remove'
                    text: null
                    id: 'clearCountyBtn'
                    disabled: true
                    tooltip: 'Clear County Selection'
                    handler: (me) =>
                        this.fireEvent('countyclear')
                        Ext.getCmp('countyCombo').select('')
                        me.disable()
                        return null
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
                        displayField: 'name'
                        valueField: 'name'
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