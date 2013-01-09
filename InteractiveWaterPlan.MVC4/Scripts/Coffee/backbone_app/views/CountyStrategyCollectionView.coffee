define([
    'namespace'
    'views/BaseTableCollectionView'
    'views/StrategyView'
    'scripts/text!templates/strategyTable.html'
],
(namespace, BaseTableCollectionView, StrategyView, tpl) ->

    class CountyStrategyCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->
            _.bindAll(this, 'fetchCallback')

            @countyId = options.id
            @countyName = options.name

            @viewName = ko.observable("#{@countyName} County")

            fetchParams = {countyId: @countyId}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/county" 
            )

            super StrategyView, 
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

            return


        render: () ->
            super

            return this
)