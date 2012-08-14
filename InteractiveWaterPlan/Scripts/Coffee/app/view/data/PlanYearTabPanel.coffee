Ext.define("ISWP.view.data.PlanYearTabPanel", {
    
    extend: 'Ext.tab.Panel'
    alias: 'widget.planyeartabpanel'

    
    items: [
        {
            title: '2012'
            layout: {
                type: 'hbox'
                align: 'stretch'
            }

            items: [
                {
                    flex: 1
                    xtype: 'waterusechart'

                }
                {
                    flex: 2
                    html: '2012 Content Area'
                    border: false
                }
            ]
        }
        {
            title: '2020'
        }
        {
            title: '2030'
        }
        {
            title: '2040'
        }
        {
            title: '2050'
        }
        {
            title: '2060'
        }

    ]
})