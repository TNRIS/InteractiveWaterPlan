Ext.define("ISWP.view.theme.WUGPanel", {
    
    extend: 'Ext.panel.Panel'
    alias: 'widget.wugpanel'

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

        me.add(Ext.create('ISWP.view.theme.WUGGrid', {
                store: me.relatedWUGStore
                emptyText: "There are no related water user groups for the chosen reservoir and decade. Try selecting a different planning decade."
                region: 'center'
            })
        )

        return null
})