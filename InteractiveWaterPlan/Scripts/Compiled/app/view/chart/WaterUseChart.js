// Generated by CoffeeScript 1.3.3

Ext.define('ISWP.view.chart.WaterUseChart', {
  extend: 'Ext.chart.Chart',
  alias: 'widget.waterusechart',
  animate: true,
  store: 'WaterUseData',
  shadow: true,
  insetPadding: 30,
  theme: 'Base:gradients',
  series: [
    {
      type: 'pie',
      field: 'Value',
      showInLegend: true,
      tips: {
        trackMouse: true,
        width: 140,
        height: 28,
        renderer: function(storeItem, item) {
          var total;
          total = 0;
          storeItem.store.each(function(rec) {
            return total += rec.get('Value');
          });
          this.setTitle("" + (storeItem.get('Name')) + ": " + (Ext.util.Format.number(storeItem.get('Value') / total * 100, '0.00%')));
          return null;
        }
      },
      highlight: {
        segment: {
          margin: 20
        },
        shadow: {
          margin: 2
        }
      },
      label: {
        field: 'Name',
        display: 'rotate',
        contrast: true,
        font: '14px Arial'
      }
    }
  ]
});
