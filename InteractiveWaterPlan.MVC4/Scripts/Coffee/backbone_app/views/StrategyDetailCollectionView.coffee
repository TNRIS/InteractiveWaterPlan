define([
    'namespace'
    'views/BaseStrategyCollectionView'
    'views/StrategyDetailView'
    'scripts/text!templates/strategyDetailTable.html'
],
(namespace, BaseStrategyCollectionView, StrategyDetailView, tpl) ->

    class StrategyDetailCollectionView extends BaseStrategyCollectionView
        
        initialize: (options) ->
            _.bindAll(this, 'fetchCallback')

            @projectId = options.id
           
            @viewName = ko.observable()

            fetchParams = {projectId: @projectId}
            
            StrategyDetailCollection = Backbone.Collection.extend(  
                url: "#{BASE_PATH}api/strategies/project" 
            )

            super StrategyDetailView, 
                StrategyDetailCollection, tpl, {fetchParams: fetchParams}

            return null

        fetchCallback: (strategyModels) ->
            #if not valid, redirect to default view
            if strategyModels.length < 1?
                alert "Invalid projectId specified."
                Backbone.history.navigate("", {trigger: true})

            #all models have the same description from this api call
            # so just grab from the first one
            @viewName(strategyModels[0].get("description"))

            super strategyModels

            return

            
)