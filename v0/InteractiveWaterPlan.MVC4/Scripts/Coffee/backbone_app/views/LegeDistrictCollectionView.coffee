define([
    'namespace'
    'views/BaseStrategyCollectionView'
    'views/DistrictStrategyView'
    'scripts/text!templates/districtStrategyTable.html'
],
(namespace, BaseStrategyCollectionView, DistrictStrategyView, tpl) ->

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
                url: "#{BASE_PATH}api/strategies/district/#{@districtType}" 
            )

            super DistrictStrategyView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}
            
            return null

)