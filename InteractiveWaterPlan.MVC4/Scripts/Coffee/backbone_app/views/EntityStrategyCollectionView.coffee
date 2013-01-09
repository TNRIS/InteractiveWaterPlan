define([
    'views/BaseTableCollectionView'
    'views/EntityStrategyView'
    'scripts/text!templates/entityStrategyTable.html'
],
(BaseTableCollectionView, EntityStrategyView, tpl) ->

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

            super EntityStrategyView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}


            return null


        render: () ->
            super

            return this
)