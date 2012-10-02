Ext.define("ISWP.view.theme.PlanningAreaDrilldown", {
    
    extend: 'Ext.container.Container'
    alias: 'widget.planningareadrilldown'
    ###
    TEXAS > Planning Region > County > Water User Group

    TEXAS > Region L > Travis County > City of Austin 
    
    
    upon selection of something, 
        * fire event with placeType and placeId
        * update child lists with resulting list
            ex: Region L is chosen, update County list to include only counties in Region L

    keep in mind:
        * clearing of a drilldown and impact on child lists
        * perhaps have dropdown ability to list all members, but put child list first
    ###

    autoEl: 
        tag: 'div'
        html: ''

    items: [
        
        {
            xtype: 'component'
            autoEl: 'span'
            html: 'TEXAS >'
        }

    ]
})