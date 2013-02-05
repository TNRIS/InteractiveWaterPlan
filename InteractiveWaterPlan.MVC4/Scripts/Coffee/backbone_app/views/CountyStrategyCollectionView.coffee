define([
    'namespace'
    'views/BaseStrategyCollectionView'
    'views/CountyStrategyView'
    'scripts/text!templates/countyStrategyTable.html'
],
(namespace, BaseStrategyCollectionView, CountyStrategyView, tpl) ->

    class CountyStrategyCollectionView extends BaseStrategyCollectionView
        
        initialize: (options) ->

            @countyId = options.id
            @countyName = options.name

            @viewName = ko.observable("#{@countyName} County")

            fetchParams = {countyId: @countyId}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_PATH}api/strategies/county" 
            )

            super CountyStrategyView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}

            
            return null

        
)