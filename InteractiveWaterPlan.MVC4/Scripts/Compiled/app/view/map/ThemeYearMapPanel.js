// Generated by CoffeeScript 1.3.3
/*
The ThemeYearMapPanel is a Panel that holds a MapComponent and
 the toolbars for controlling the current data view of the application.
*/

Ext.define('ISWP.view.map.ThemeYearMapPanel', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.themeyearmappanel',
  layout: 'fit',
  items: [
    {
      xtype: 'mapcomponent',
      id: 'mapComponent'
    }
  ],
  dockedItems: [
    {
      xtype: 'toolbar',
      dock: 'bottom',
      id: 'yearButtonBar',
      items: [
        'Planning Decade: ', {
          xtype: 'button',
          text: '2010',
          year: 2010,
          pressed: true,
          allowDepress: false,
          toggleGroup: 'yearButtons'
        }, {
          xtype: 'button',
          text: '2020',
          year: 2020,
          allowDepress: false,
          toggleGroup: 'yearButtons'
        }, {
          xtype: 'button',
          text: '2030',
          year: 2030,
          allowDepress: false,
          toggleGroup: 'yearButtons'
        }, {
          xtype: 'button',
          text: '2040',
          year: 2040,
          allowDepress: false,
          toggleGroup: 'yearButtons'
        }, {
          xtype: 'button',
          text: '2050',
          year: 2050,
          allowDepress: false,
          toggleGroup: 'yearButtons'
        }, {
          xtype: 'button',
          text: '2060',
          year: 2060,
          allowDepress: false,
          toggleGroup: 'yearButtons'
        }, '->', {
          xtype: 'button',
          text: 'Zoom to Texas',
          id: 'resetExtentButton',
          iconCls: 'icon-fullscreen'
        }, '-', {
          xtype: 'combobox',
          id: 'placeCombo',
          typeAhead: true,
          store: 'Place',
          queryMode: 'remote',
          queryCaching: true,
          queryParam: 'name',
          queryDelay: 200,
          typeAheadDelay: 200,
          minChars: 2,
          hideTrigger: true,
          valueField: 'SqlId',
          displayField: 'Name',
          emptyText: 'Go to Location',
          width: 240,
          listConfig: {
            getInnerTpl: function() {
              return '<div data-qtip="{Name} ({CategoryName})">{Name} <span class="catName">{CategoryName}</span></div>';
            }
          }
        }, {
          xtype: 'button',
          iconCls: 'icon-remove',
          text: null,
          id: 'clearPlaceButton'
        }
      ]
    }, {
      xtype: 'toolbar',
      dock: 'left',
      id: 'themeButtonBar',
      items: [
        {
          xtype: 'button',
          text: 'Existing<br/>Supply',
          theme: 'water-use',
          allowDepress: false,
          toggleGroup: 'themeButtons'
        }, {
          xtype: 'button',
          text: 'Recommended<br/>Reservoirs',
          theme: 'proposed-reservoirs',
          pressed: true,
          allowDepress: false,
          toggleGroup: 'themeButtons'
        }
      ]
    }
  ],
  getSelectedTheme: function() {
    var selectedTheme;
    selectedTheme = null;
    this.dockedItems.getByKey('themeButtonBar').items.each(function(item) {
      if (item.xtype === 'button' && item.pressed) {
        selectedTheme = item.theme;
        return false;
      }
    });
    return selectedTheme;
  },
  getSelectedYear: function() {
    var selectedYear;
    selectedYear = null;
    this.dockedItems.getByKey('yearButtonBar').items.each(function(item) {
      if (item.xtype === 'button' && item.pressed) {
        selectedYear = item.year;
        return false;
      }
    });
    return selectedYear;
  }
});
