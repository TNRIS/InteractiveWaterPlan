
Ext.define('ISWP.view.chart.WaterUseChart', {
    
    extend: 'Ext.chart.Chart'

    alias: 'widget.waterusechart'

    animate: true
    shadow: true
    #legend: 
    #    position: 'right'
    
    insetPadding: 30
    theme: 'Blue:gradients'

    series: [
        {
            type: 'pie'
            field: 'Value'
            showInLegend: true
            tips:
                trackMouse: true

                width: 160
                height: 28
                renderer: (storeItem, item) ->
                    total = 0
                    storeItem.store.each( (rec) ->
                        total += rec.get('Value')
                    )

                    this.setTitle("#{storeItem.data.Name}<br/>
                        #{Ext.util.Format.number(storeItem.get('Value'), '0,000,000,000')} ac-ft 
                        (#{Ext.util.Format.number(storeItem.get('Value')/total*100,'0.00%')})"
                    )
                    
                    return null

            highlight:
                segment:
                    margin: 20
                
            label:
                field: 'Name'
                display: 'rotate'
                contrast: true
                font: '12px Arial'
        }
    ]

})