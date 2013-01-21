define([
    'namespace'
    'views/BaseTableCollectionView'
    'views/CountyNetSupplyView'
    'collections/CountyNetSupplyCollection'
    'scripts/text!templates/countyNetSupplyTable.html'
],
(namespace, BaseTableCollectionView, CountyNetSupplyView, 
    CountyNetSupplyCollection, tpl) ->

    class CountyNetSupplyCollectionView extends BaseTableCollectionView

        initialize: (options) ->

            @mapView = options.mapView

            RegionCollection = Backbone.Collection.extend(
                url: "#{BASE_API_PATH}api/boundary/regions/all"
            )

            @regionCollection = new RegionCollection()

            super CountyNetSupplyView, 
                CountyNetSupplyCollection, tpl
           
            return

        #override so we can destroy the regionLayer
        unrender: () ->
            if @regionLayer? then @regionLayer.destroy()
            return super
            
        #override the super's because we don't need to do any WUG feature stuff
        # but we do need do region highlighting
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

                        #Don't need to do this stuff
                        #this._connectTableRowsToWugFeatures()
                        #if this.fetchCallback? and _.isFunction(this.fetchCallback)
                        #    this.fetchCallback(collection.models)

                        this.trigger("table:endload")

                    return   

                error: () =>
                    this.trigger("table:fetcherror")
                    return
            )

            @regionCollection.fetch(

                success: (regionCollection) =>
                    console.log regionCollection

                    wktFormat = new OpenLayers.Format.WKT()

                    regionFeatures = []

                    for region in regionCollection.models
                        newFeature = wktFormat.read(region.get('wktGeog'))
                        newFeature.attributes = region.attributes
                        
                        delete newFeature.attributes.wktGeog
                        
                        newFeature.geometry = @mapView.transformToWebMerc(
                            newFeature.geometry)
                
                        regionFeatures.push(newFeature)


                    @regionLayer = new OpenLayers.Layer.Vector(
                        "Region Feature Layer",
                        {
                            displayInLayerSwitcher: false
                            #styleMap TODO: just outline? then outline bolder on mouse over?
                        }
                    )
                    @regionLayer.addFeatures(regionFeatures)

                    @mapView.map.addLayer(@regionLayer)

                    return
            )

            return

)