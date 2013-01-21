define([
    'namespace'
    'views/BaseTableCollectionView'
    'views/RegionStrategyView'
    'scripts/text!templates/regionStrategyTable.html'
],
(namespace, BaseTableCollectionView, StrategyView, tpl) ->

    class RegionStrategyCollectionView extends BaseTableCollectionView
        
        initialize: (options) ->
            
            @regionLetter = options.id
            
            @viewName = ko.observable("Region #{@regionLetter}")

            @mapView = options.mapView

            fetchParams = {regionLetter: @regionLetter}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/region" 
            )

            RegionModel = Backbone.Model.extend(
                url: "#{BASE_API_PATH}api/boundary/region/#{@regionLetter}"
            )

            @region = new RegionModel()

            super StrategyView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}
            
            return null

        #override the super's fetchCollection
        #This one works a bit differently in that no WUGs are shown, 
        # but the region needs to be zoomed to
        fetchCollection: () ->

            this.$('tbody').empty() #clear the table contents

            #always include the current year in the fetch parameters
            params = _.extend({year: namespace.currYear }, @fetchParams)

            this.trigger("table:startload")

            @collection.fetch(
                data: params
                
                success: (collection) =>
                    
                    if collection.models.length == 0
                        this.trigger("table:nothingfound")

                    else
                        for m in collection.models
                            this.appendModel(m)

                        this.$('.has-popover').popover(trigger: 'hover')

                        this._setupDataTable()

                        #don't need to do this
                        #this._connectTableRowsToWugFeatures()
                        #if this.fetchCallback? and _.isFunction(this.fetchCallback)
                        #    this.fetchCallback(collection.models)

                        this.trigger("table:endload")

                    return   

                error: () =>
                    this.trigger("table:fetcherror")
                    return
            )

            #we also need to fetch the geography for the region 
            # and zoom the map to it
            @region.fetch(
                success: (model) =>
                    
                    wktFormat = new OpenLayers.Format.WKT()
                    
                    regionFeature = wktFormat.read(model.get('wktGeog'))
                    regionFeature.geometry = @mapView.transformToWebMerc(
                        regionFeature.geometry)

                    bounds = regionFeature.geometry.getBounds()
                    @mapView.map.zoomToExtent(bounds)

                    return
            )

            return

)