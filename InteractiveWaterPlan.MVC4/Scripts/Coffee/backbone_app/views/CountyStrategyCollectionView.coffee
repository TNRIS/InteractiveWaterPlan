define([
    'views/BaseTableCollectionView'
    'views/StrategyView'
    'scripts/text!templates/strategyTable.html'
],
(BaseTableCollectionView, StrategyView, tpl) ->

    class CountyStrategyCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->
            _.bindAll(this, 'selectType', 'fetchCallback')

            @countyId = options.id
            @countyName = options.name

            @viewName = "#{@countyName} County"

            fetchParams = {countyId: @countyId}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/county" 
            )

            super options.currYear, StrategyView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}

            @selectedType = ko.observable()
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

            _.each(newWugList, (m) ->
                @wugArray.push(m)
                return
            )
            return


        render: () ->
            super

            this.$('#strategyPlaceName').html(@viewName)

            return this

        selectType: (data, target) ->
            $target = $(event.target)

            #set the observable to the selected county id and name
            typeId = $target.data('value')
            typeName = $target.data('name')
            
            @selectedType(
                id: typeId
                name: typeName
            )

            return
)