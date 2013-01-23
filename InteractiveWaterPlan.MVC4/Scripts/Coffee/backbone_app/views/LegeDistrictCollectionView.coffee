define([
    'namespace'
    'views/BaseStrategyCollectionView'
    'views/StrategyView'
    'scripts/text!templates/strategyTable.html'
],
(namespace, BaseStrategyCollectionView, StrategyView, tpl) ->

    class LegeDistrictCollectionView extends BaseStrategyCollectionView
        
        initialize: (options) ->
            
            if not options.type? or not options.type == "house" or not options.type == "senate"
                throw "Options.type myst be 'house' or 'senate'."

            @districtType = options.type

            @districtId = options.id
            @districtName = options.name
            
            @viewName = ko.observable("#{@districtName}")

            fetchParams = {districtId: @districtId}

            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/district/#{@districtType}" 
            )

            super StrategyView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}
            
            return null

)