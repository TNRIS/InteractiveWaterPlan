define([
    'namespace'
    'views/BaseStrategyCollectionView'
    'views/StrategyTypeView'
    'scripts/text!templates/strategyTypeTable.html'
],
(namespace, BaseStrategyCollectionView, StrategyTypeView, tpl) ->

    class StrategyTypeCollectionView extends BaseStrategyCollectionView
        
        initialize: (options) ->
            
            @typeId = options.id
            @typeName = options.name

            @viewName = ko.observable("#{@typeName}")

            fetchParams = {typeId: @typeId}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_PATH}api/strategies/type" 
            )

            super StrategyTypeView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}

            return null

            
)