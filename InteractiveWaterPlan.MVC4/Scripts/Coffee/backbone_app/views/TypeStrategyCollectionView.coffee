define([
    'views/BaseTableCollectionView'
    'views/StrategyTypeView'
    'scripts/text!templates/strategyTypeTable.html'
],
(BaseTableCollectionView, StrategyTypeView, tpl) ->

    class TypeStrategyCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->
            @typeId = options.id
            @typeName = options.name

            @viewName = "#{@typeName} Strategies"

            fetchParams = {typeId: @typeId}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategy" 
            )

            super options.currYear, StrategyTypeView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}

            @selectedRegion = ko.observable()

            return null

        render: () ->
            super

            this.$('#strategyTypeName').html(@viewName)

            return this
            
        selectRegion: (data, event) ->
            $target = $(event.target)

            #set the observable to the selected region id and name
            regionId = $target.data('value')
            regionName = $target.data('name')
            @selectedRegion({
                id: regionId
                name: regionName
            })
            
            return null
)