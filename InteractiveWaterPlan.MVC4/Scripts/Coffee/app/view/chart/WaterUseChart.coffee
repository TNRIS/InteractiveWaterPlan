Ext.define('ISWP.view.chart.WaterUseChart', {
    
    extend: 'Ext.chart.Chart'

    alias: 'widget.waterusechart'

    animate: false

    shadow: true

    background:
        fill: 'rgb(255, 255, 255)'
            
    theme: 'ISWP' #defined at the bottom of this file

    axes: [
        {
            type: 'Numeric'
            position: 'left'
            fields: ['value']
            label:
                renderer: Ext.util.Format.numberRenderer('0,0')

            title: 'Supply (acre-feet/year)'

            minimum: 0
            grid: false
        }
        {
            type: 'Category'
            position: 'bottom'
            fields: ['name']
            title: 'Supply Category'
        }
    ]

    series: [
        {
            type: 'column'
            axis: 'left'
            highlight: true

            xField: 'name',
            yField: 'value'
            
            renderer: (sprite, storeItem, barAttr, i, store) ->
                colors = ['#7eae29', '#fdbe2a', '#910019', '#27b4bc', '#d74dbc']
                barAttr.fill = colors[i % colors.length]
                return barAttr

            label:
                display: 'outsideEnd'
                field: 'value'
                renderer: Ext.util.Format.numberRenderer('0,0')
                orientation: 'horizontal'
                'text-anchor': 'middle'

            tips:
                trackMouse: true

                width: 160
                height: 28
                renderer: (storeItem, item) ->
                    total = 0
                    storeItem.store.each( (rec) ->
                        total += rec.get('value')
                    )

                    this.setTitle("#{storeItem.data.name}<br/>
                        #{Ext.util.Format.number(storeItem.get('value'), '0,0')} ac-ft 
                        (#{Ext.util.Format.number(storeItem.get('value')/total*100,'0.00%')})"
                    )
                    
                    return null
        }
    ]
})

Ext.define('Ext.chart.theme.ISWP', {
    extend: 'Ext.chart.theme.Base',
    
    constructor: (config) ->
        this.callParent([Ext.apply({
            axisTitleLeft: 
                font: 'bold 14px Helvetica, sans-serif'

            axisTitleBottom: 
                font: 'bold 14px Helvetica, sans-serif'

        }, config)])
        
    
})