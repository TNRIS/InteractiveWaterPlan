define([
    'namespace'
    'views/BaseTableCollectionView'
    'views/StrategyDetailView'
    'scripts/text!templates/strategyDetailTable.html'
],
(namespace, BaseTableCollectionView, StrategyDetailView, tpl) ->

    class StrategyDetailCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->
            _.bindAll(this, 'fetchCallback')

            @projectId = options.id
           
            @viewName = ko.observable()

            fetchParams = {projectId: @projectId}
            
            StrategyDetailCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/project" 
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