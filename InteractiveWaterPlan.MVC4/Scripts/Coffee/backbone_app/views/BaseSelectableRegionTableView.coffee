define([
    'namespace'
    'views/BaseTableCollectionView'
],
(namespace, BaseTableCollectionView) ->

    class BaseSelectableRegionTableView extends BaseTableCollectionView

        initialize: (ModelView, Collection, tpl, mapView, options) ->

            super ModelView, Collection, tpl, options

            _.bindAll(this, 'onRegionCollectionSuccess')

            @mapView = mapView

            RegionCollection = Backbone.Collection.extend(
                url: "#{BASE_API_PATH}api/boundary/regions/all"
            )

            @regionCollection = new RegionCollection()

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
                success: this.onRegionCollectionSuccess
            )

            return

        onRegionCollectionSuccess: (regionCollection) ->
                   
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