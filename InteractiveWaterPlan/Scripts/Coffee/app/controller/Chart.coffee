Ext.define('ISWP.controller.Chart', {

    extend: 'Ext.app.Controller'

    views: [
        'chart.WaterUseChart'
    ]

    stores: [
        'WaterUseData'
    ]


    refs: [
        ref: 'waterUseChart'
        selector: '#waterUseChart'
    ]

    init: () ->
        this.control({
            'waterusechart': {
                render: (chart) ->
                   
                    return null
            }
        })
})