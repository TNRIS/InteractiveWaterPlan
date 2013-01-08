define([
    'views/BaseTableCollectionView'
    'views/StrategyTypeView'
    'scripts/text!templates/strategyTypeTable.html'
],
(BaseTableCollectionView, StrategyTypeView, tpl) ->

    class StrategyTypeCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->
            @typeId = options.id
            @typeName = options.name

            @viewName = "#{@typeName} Strategies"

            fetchParams = {typeId: @typeId}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/type" 
            )

            super options.currYear, StrategyTypeView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}

            return null

        render: () ->
            super

            this.$('#strategyTypeName').html(@viewName)

            return this
            
)