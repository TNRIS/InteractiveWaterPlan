// Generated by CoffeeScript 1.3.3

Ext.define('ISWP.view.chart.WaterUseChart', {
  extend: 'Ext.chart.Chart',
  alias: 'widget.waterusechart',
  animate: false,
  shadow: true,
  background: {
    fill: 'rgb(255, 255, 255)'
  },
  theme: 'ISWP',
  axes: [
    {
      type: 'Numeric',
      position: 'left',
      fields: ['Value'],
      label: {
        renderer: Ext.util.Format.numberRenderer('0,0')
      },
      title: 'Supply (acre-feet/year)',
      minimum: 0,
      grid: false
    }, {
      type: 'Category',
      position: 'bottom',
      fields: ['Name'],
      title: 'Supply Category'
    }
  ],
  series: [
    {
      type: 'column',
      axis: 'left',
      highlight: true,
      xField: 'Name',
      yField: 'Value',
      renderer: function(sprite, storeItem, barAttr, i, store) {
        var colors;
        colors = ['#7eae29', '#fdbe2a', '#910019', '#27b4bc', '#d74dbc'];
        barAttr.fill = colors[i % colors.length];
        return barAttr;
      },
      label: {
        display: 'outsideEnd',
        field: 'Value',
        renderer: Ext.util.Format.numberRenderer('0,0'),
        orientation: 'horizontal',
        'text-anchor': 'middle'
      },
      tips: {
        trackMouse: true,
        width: 160,
        height: 28,
        renderer: function(storeItem, item) {
          var total;
          total = 0;
          storeItem.store.each(function(rec) {
            return total += rec.get('Value');
          });
          this.setTitle("" + storeItem.data.Name + "<br/>                        " + (Ext.util.Format.number(storeItem.get('Value'), '0,0')) + " ac-ft                         (" + (Ext.util.Format.number(storeItem.get('Value') / total * 100, '0.00%')) + ")");
          return null;
        }
      }
    }
  ]
});

Ext.define('Ext.chart.theme.ISWP', {
  extend: 'Ext.chart.theme.Base',
  constructor: function(config) {
    return this.callParent([
      Ext.apply({
        axisTitleLeft: {
          font: 'bold 14px Helvetica, sans-serif'
        },
        axisTitleBottom: {
          font: 'bold 14px Helvetica, sans-serif'
        }
      }, config)
    ]);
  }
});
