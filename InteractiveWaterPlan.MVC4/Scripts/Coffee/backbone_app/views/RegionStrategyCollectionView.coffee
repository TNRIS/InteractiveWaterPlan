define([
    'views/BaseTableCollectionView'
    'views/StrategyView'
    'scripts/text!templates/strategyTable.html'
],
(BaseTableCollectionView, StrategyView, tpl) ->

    class RegionStrategyCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->

            @regionLetter = options.id
            
            @viewName = ko.observable("Region #{@regionLetter}")

            fetchParams = {regionLetter: @regionLetter}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/region" 
            )

            super options.currYear, StrategyView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}

            
            return null

        render: () ->
            super

            #TODO: make this use an observable
            this.$('#strategyPlaceName').html(@viewName())

            return this

)