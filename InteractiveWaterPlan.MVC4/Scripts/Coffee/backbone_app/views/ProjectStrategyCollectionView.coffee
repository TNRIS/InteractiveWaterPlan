define([
    'namespace'
    'views/BaseStrategyCollectionView'
    'views/ProjectStrategyView'
    'scripts/text!templates/projectStrategyTable.html'
],
(namespace, BaseStrategyCollectionView, ProjectStrategyView, tpl) ->

    class ProjectStrategyCollectionView extends BaseStrategyCollectionView
        
        initialize: (options) ->
            _.bindAll(this, 'fetchCallback')

            @projectId = options.id
           
            @viewName = ko.observable()

            fetchParams = {projectId: @projectId}
            
            ProjectStrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_PATH}api/strategies/project" 
            )

            super ProjectStrategyView, 
                ProjectStrategyCollection, tpl, {fetchParams: fetchParams}

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