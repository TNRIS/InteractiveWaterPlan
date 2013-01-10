define([
    'namespace'
    'views/BaseTableCollectionView'
    'views/StrategyTypeView'
    'scripts/text!templates/strategyTypeTable.html'
],
(namespace, BaseTableCollectionView, StrategyTypeView, tpl) ->

    class StrategyTypeCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->
            
            @typeId = options.id
            @typeName = options.name

            @viewName = ko.observable("#{@typeName}")

            fetchParams = {typeId: @typeId}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/type" 
            )

            super StrategyTypeView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}

            return null

            
)