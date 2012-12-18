define([
    'views/BaseTableCollectionView'
    'views/StrategyView'
    'scripts/text!templates/strategyTable.html'
],
(BaseTableCollectionView, StrategyView, tpl) ->

    class RegionStrategyCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->
            @regionId = options.regionId
            @regionName = options.regionName

            @viewName = "Region #{@regionName}"

            fetchParams = {regionId: @regionId}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategy" 
            )

            super options.currYear, StrategyView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}


            return null

        render: () ->
            super

            #TODO: render based on year etc
            this.$('#strategyPlaceName').html(@viewName)

            return this
            
        selectType: (data, target) ->
            $target = $(event.target)
            console.log "TODO: Select Strategy Type"

            #set the observable to the selected county id and name
            typeId = $target.attr('data-value')
            typeName = $target.attr('data-name')
            
            #TODO: set observable
            #@selectedCounty({
            #    countyId: countyId
            #    countyName: countyName
            #})

            return
)