define([
    'namespace'
    'views/BaseTableCollectionView'
    'views/CountyStrategyView'
    'scripts/text!templates/countyStrategyTable.html'
],
(namespace, BaseTableCollectionView, CountyStrategyView, tpl) ->

    class CountyStrategyCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->

            @countyId = options.id
            @countyName = options.name

            @viewName = ko.observable("#{@countyName} County")

            fetchParams = {countyId: @countyId}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/county" 
            )

            super CountyStrategyView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}

            
            return null

        
)