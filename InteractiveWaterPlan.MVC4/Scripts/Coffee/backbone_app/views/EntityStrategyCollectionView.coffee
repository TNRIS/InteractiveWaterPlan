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
            
            @viewName = ko.observable()

            fetchParams = {entityId: @entityId}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/entity" 
            )

            super EntityStrategyView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}

            #get the entity name from an API call
            EntityModel = Backbone.Model.extend(
                url: "#{BASE_API_PATH}api/entity/#{@entityId}" 
            )

            entity = new EntityModel()

            entity.fetch(
                success: (model) =>
                    @viewName(model.get("name"))
                    return
            )

            return null


        render: () ->
            super

            return this
)