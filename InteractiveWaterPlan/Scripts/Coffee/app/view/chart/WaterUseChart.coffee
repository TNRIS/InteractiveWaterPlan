
Ext.define('ISWP.view.chart.WaterUseChart', {
    
    extend: 'Ext.chart.Chart'

    alias: 'widget.waterusechart'

    animate: true
    store: 'WaterUseData'

    shadow: true
    #legend: 
    #    position: 'right'
    
    insetPadding: 30
    theme: 'Base:gradients'

    series: [
        {
            type: 'pie'
            field: 'Value'
            showInLegend: true
            
            tips:
                trackMouse: true
                anchorToTarget: true
                width: 140
                height: 28
                renderer: (storeItem, item) ->
                    total = 0
                    storeItem.store.each( (rec) ->
                        total += rec.get('Value')
                    )

                    this.setTitle("#{storeItem.get('Name')}: #{Ext.util.Format.number(storeItem.get('Value')/total*100,'0.00%')}")
                    return null

            highlight:
                segment:
                    margin: 20
                shadow:
                    margin: 2
            label:
                field: 'Name'
                display: 'rotate'
                contrast: true
                font: '14px Arial'
        }
    ]

})