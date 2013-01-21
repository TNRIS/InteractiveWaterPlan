define([
    'namespace'
    'views/BaseSelectableRegionTableView'
    'views/RegionStrategyView'
    'scripts/text!templates/regionStrategyTable.html'
],
(namespace, BaseSelectableRegionTableView, RegionStrategyView, tpl) ->

    class RegionStrategyCollectionView extends BaseSelectableRegionTableView
        
        initialize: (options) ->
            
            @regionLetter = options.id
            
            @viewName = ko.observable("Region #{@regionLetter}")

            fetchParams = {regionLetter: @regionLetter}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/region" 
            )

            super RegionStrategyView, StrategyCollection, tpl, options.mapView,
                {fetchParams: fetchParams}
            
            return null

        #override the super's onRegionCollectionSuccess
        #to also zoom to the current region's extent
        onRegionCollectionSuccess: (regionCollection) ->
            super regionCollection

            #find the associated region in the regionLayer's features
            matchedRegion = _.find(@regionLayer.features, 
                (regionFeature) =>
                    return regionFeature.attributes.letter == @regionLetter
            )
            
            bounds = matchedRegion.geometry.getBounds()
            @mapView.map.zoomToExtent(bounds)

            return
)