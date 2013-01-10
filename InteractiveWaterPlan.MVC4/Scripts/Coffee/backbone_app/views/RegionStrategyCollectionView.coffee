define([
    'namespace'
    'views/BaseTableCollectionView'
    'views/StrategyView'
    'scripts/text!templates/strategyTable.html'
],
(namespace, BaseTableCollectionView, StrategyView, tpl) ->

    class RegionStrategyCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->
            
            @regionLetter = options.id
            
            @viewName = ko.observable("Region #{@regionLetter}")

            fetchParams = {regionLetter: @regionLetter}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/region" 
            )

            super StrategyView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}

            
            return null

)