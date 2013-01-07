define([
    'views/BaseTableCollectionView'
    'views/StrategyView'
    'scripts/text!templates/entityStrategyTable.html'
],
(BaseTableCollectionView, StrategyView, tpl) ->

    class EntityStrategyCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->
            _.bindAll(this)

            @entityId = options.id
            @entityName = options.name

            @viewName = ko.observable("#{@entityName}")

            fetchParams = {entityId: @entityId}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/entity" 
            )

            super options.currYear, StrategyView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}


            return null


        render: () ->
            super

            return this
)