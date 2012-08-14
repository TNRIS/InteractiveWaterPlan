Ext.define('ISWP.controller.Data', {

    extend: 'Ext.app.Controller'

    views: [
        'chart.WaterUseChart'
        'data.MainPanel'
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
    ]


    init: () ->
        this.control({
            'mainpanel button[toggleGroup=yearButtons]':
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