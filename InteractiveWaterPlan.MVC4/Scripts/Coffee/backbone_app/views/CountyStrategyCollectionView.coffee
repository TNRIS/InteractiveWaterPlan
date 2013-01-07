define([
    'views/BaseTableCollectionView'
    'views/StrategyView'
    'scripts/text!templates/strategyTable.html'
],
(BaseTableCollectionView, StrategyView, tpl) ->

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

            super options.currYear, StrategyView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}

            @wugArray = ko.observableArray()

            return null

        fetchCallback: (models) ->
            #TODO: Use underscore to map WUG properties to new WUG object
            # and then add them all to the @wugArray observable array
            newWugList = _.map(models, (m) ->
                return {
                    id: m.get("recipientEntityId")
                    name: m.get("recipientEntityName")
                    wktGeog: m.get("recipientEntityWktGeog")
                }
            )

            for m in newWugList
                @wugArray.push(m)

            return


        render: () ->
            super

            return this
)