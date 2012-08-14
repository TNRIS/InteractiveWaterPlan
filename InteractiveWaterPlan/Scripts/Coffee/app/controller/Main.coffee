Ext.define('ISWP.controller.Main', {

    extend: 'Ext.app.Controller'

    views: [
        'chart.WaterUseChart'
        'data.MainPanel'
        'map.MapComponent'
        'map.ThemeYearMapPanel'
    ]

    stores: [
        'WaterUseData'
    ]

    refs: [
        {
            ref: 'mainPanel'
            selector: 'mainpanel'
        }
        {
            ref: 'mainChart'
            selector: '#mainChart'
        }
        {
            ref: 'mainContent'
            selector: '#mainContent'
        }
        {
            ref: 'mapComponent'
            selector: 'mapcomponent'
        }
    ]


    init: () ->
        this.control({
            'mapcomponent': 
                render: (mapComp) ->
                    mapComp.map = mapComp.initializeMap(mapComp.el.dom)
                    
                    return null

            'button[toggleGroup=yearButtons]':
                click: (btn, evt) ->
                    this.getMainChart().store.load({
                        params:
                            Year: btn.year
                            LocationType: 'State'
                            LocationName: 'Texas'
                        })


                    this.getMainContent().update("Main content for #{btn.year}")

                    return null

            '#mainChart':
                render: (chart) ->
                    chart.store.load({
                        params:
                            Year: 2012
                            LocationType: 'State'
                            LocationName: 'Texas'
                        })
                    return null
        })
})