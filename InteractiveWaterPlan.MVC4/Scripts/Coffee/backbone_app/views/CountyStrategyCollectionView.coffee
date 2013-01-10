define([
    'namespace'
    'views/BaseTableCollectionView'
    'views/StrategyView'
    'scripts/text!templates/strategyTable.html'
],
(namespace, BaseTableCollectionView, StrategyView, tpl) ->

    class CountyStrategyCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->

            @countyId = options.id
            @countyName = options.name

            @viewName = ko.observable("#{@countyName} County")

            fetchParams = {countyId: @countyId}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/county" 
            )

            super StrategyView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}

            
            return null

        
)