define([
    'namespace'
    'views/BaseTableCollectionView'
    'views/StrategyTypeView'
    'scripts/text!templates/strategyTypeTable.html'
],
(namespace, BaseTableCollectionView, StrategyTypeView, tpl) ->

    class StrategyTypeCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->
            _.bindAll(this, 'fetchCallback')

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


        fetchCallback: (strategyModels) ->
            #Use underscore to map WUG properties to new WUG object
            # and then add them all to the namespace.wugFeatureCollection
            newWugList = _.map(strategyModels, (m) ->
                return {
                    id: m.get("recipientEntityId")
                    name: m.get("recipientEntityName")
                    wktGeog: m.get("recipientEntityWktGeog")
                }
            )

            namespace.wugFeatureCollection.reset(newWugList)

        render: () ->
            super

            return this
            
)