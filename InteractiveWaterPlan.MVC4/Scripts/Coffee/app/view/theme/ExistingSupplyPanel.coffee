Ext.define("ISWP.view.theme.ExistingSupplyPanel", {
    
    extend: 'Ext.panel.Panel'
    alias: 'widget.existingsupplypanel'

    layout: 'border'
       
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
                    #flex: 1
                    listeners:
                        'select': ()->
                            return null

                }
                {
                    xtype: 'button'
                    iconCls: 'icon-remove'
                    text: null
                    id: 'clearRegionBtn'
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
                    #flex: 1
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
                }
                "&raquo; "
                {
                    xtype: 'combobox'
                    id: 'wugCombo'
                    store: 'Entity' #TODO: Modify/create store to get WUGs IN CountyId
                    displayField: 'Name'
                    valueField: 'SqlId'
                    queryMode: 'local'
                    emptyText: 'Select a Water  User Group'
                    editable: false
                    width: 200
                    #flex: 1
                }
            ]
        })
        
        
        #TODO: Add 'Editor's to combobox+removeBtns

        me.add(topPanel)

        me.add(Ext.create('Ext.panel.Panel', {
                region: 'center'


            })
        )

        return null
})