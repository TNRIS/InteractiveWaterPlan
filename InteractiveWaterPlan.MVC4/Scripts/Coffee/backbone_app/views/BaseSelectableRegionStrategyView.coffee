define([
    'namespace'
    'collections/RegionFeatureCollection'
    'views/BaseStrategyCollectionView'
],
(namespace, RegionFeatureCollection, BaseStrategyCollectionView) ->

    class BaseSelectableRegionStrategyView extends BaseStrategyCollectionView

        initialize: (ModelView, Collection, tpl, mapView, options) ->

            super ModelView, Collection, tpl, options

            _.bindAll(this, 'showRegionFeatures', 'onStrategyCollectionSuccess')

            @mapView = mapView

            @regionCollection = null

            return

        #override so we can destroy the regionLayer
        unrender: () ->
            if @regionHighlightControl? then @regionHighlightControl.destroy()
            if @regionClickControl? then @regionClickControl.destroy()
            if @regionLayer? then @regionLayer.destroy()
            return super
            
        #override the super's because we don't need to do any WUG feature stuff
        # but we do need do region highlighting
        fetchCollection: () ->

            this.$('tbody').empty() #clear the table contents

            #always include the current year in the fetch parameters
            params = _.extend({year: namespace.currYear }, @fetchParams)

            this.trigger("table:startload")

            #Fetch the strategy collection
            deferred = @collection.fetch(
                data: params
                success: this.onStrategyCollectionSuccess
            )

            deferred
                .then(() => 
                    this.trigger("table:endload")
                    return
                )
                .fail(() =>
                    this.trigger("table:fetcherror")
                    return
                )

            return

        onStrategyCollectionSuccess: (collection) ->
            if collection.models.length == 0
                this.trigger("table:nothingfound")

            else
                for m in collection.models
                    this.appendModel(m)

                this.$('.has-popover').popover(trigger: 'hover')

                this._setupDataTable()

                #get the region features out of the namespace
                
                @regionCollection = namespace.regionFeatures
                # and add to map
                this.showRegionFeatures()
                
            return   

        showRegionFeatures: () ->
                   
            wktFormat = new OpenLayers.Format.WKT()

            regionFeatures = []

            for region in @regionCollection.models
                newFeature = wktFormat.read(region.get('wktGeog'))
                newFeature.attributes = _.clone(region.attributes)
                
                #but we don't need to carry about the large wktGeog
                delete newFeature.attributes.wktGeog
                
                newFeature.geometry = @mapView.transformToWebMerc(
                    newFeature.geometry)
        
                regionFeatures.push(newFeature)


            @regionLayer = new OpenLayers.Layer.Vector(
                "Region Feature Layer",
                {
                    displayInLayerSwitcher: false
                    styleMap: new OpenLayers.StyleMap(
                        "default" : new OpenLayers.Style( 
                            strokeColor: "gray"
                            strokeWidth: 0
                            fillColor: "white"
                            fillOpacity: 0
                        )
                        "select" : new OpenLayers.Style(
                            fillColor: "yellow"
                            strokeColor: "orange"
                            strokeWidth: 2
                            fillOpacity: 0.2
                        )
                    )
                }
            )
            @regionLayer.addFeatures(regionFeatures)

            @mapView.map.addLayer(@regionLayer)

            @regionHighlightControl = new OpenLayers.Control.SelectFeature(
                @regionLayer,
                {
                    autoActivate: true
                    hover: true
                })

            @mapView.map.addControl(@regionHighlightControl)

            #OL workaround to allow dragging while over a feature
            # see http://trac.osgeo.org/openlayers/wiki/SelectFeatureControlMapDragIssues    
            @regionHighlightControl.handlers.feature.stopDown = false;

            @regionClickControl = new OpenLayers.Control.SelectFeature(
                @regionLayer,
                {
                    autoActivate: true
                    
                    clickFeature: (regionFeature) ->
                        #else navigate to Region Details view when feature is clicked
                        regionLetter = regionFeature.attributes.letter
                        Backbone.history.navigate("#/#{namespace.currYear}/wms/region/#{regionLetter}", 
                            {trigger: true})
            
                        return
                })

            @mapView.map.addControl(@regionClickControl)

            #OL workaround again
            @regionClickControl.handlers.feature.stopDown = false;
           
            return
            

)