define([
    'views/BaseTableCollectionView'
    'views/StrategyView'
    'scripts/text!templates/strategyTable.html'
],
(BaseTableCollectionView, StrategyView, tpl) ->

    class RegionStrategyCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->

            _.bindAll(this, 'selectType')

            @regionId = options.id
            @regionName = options.name

            @viewName = "Region #{@regionName}"

            fetchParams = {regionId: @regionId}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategy" 
            )

            super options.currYear, StrategyView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}

            @selectedType = ko.observable()
            
            return null

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