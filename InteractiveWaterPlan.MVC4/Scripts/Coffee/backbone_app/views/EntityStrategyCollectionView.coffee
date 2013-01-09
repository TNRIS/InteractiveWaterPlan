define([
    'namespace'
    'views/BaseTableCollectionView'
    'views/EntityStrategyView'
    'scripts/text!templates/entityStrategyTable.html'
],
(namespace, BaseTableCollectionView, EntityStrategyView, tpl) ->

    class EntityStrategyCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->
            _.bindAll(this, 'fetchCallback')

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

        fetchCallback: (strategyModels) ->
            #While there may be multiple Strategies in the models collection
            # they should all have the same entity at this point

            newWugList = []

            wug = strategyModels[0]

            newWugList.push(
                id: wug.get("recipientEntityId")
                name: wug.get("recipientEntityName")
                wktGeog: wug.get("recipientEntityWktGeog")
            )

            namespace.wugFeatureCollection.reset(newWugList)
            return

)