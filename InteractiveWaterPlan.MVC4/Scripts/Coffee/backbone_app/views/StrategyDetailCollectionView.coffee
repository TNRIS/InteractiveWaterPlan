define([
    'namespace'
    'views/BaseTableCollectionView'
    'views/StrategyDetailView'
    'scripts/text!templates/strategyDetailTable.html'
],
(namespace, BaseTableCollectionView, StrategyDetailView, tpl) ->

    class StrategyDetailCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->
            
            @projectId = options.id
            @projectName = options.name

            @viewName = ko.observable("#{@projectName}")

            fetchParams = {projectId: @projectId}
            
            StrategyDetailCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/type" 
            )

            super StrategyDetailView, 
                StrategyDetailCollection, tpl, {fetchParams: fetchParams}

            return null

            
)