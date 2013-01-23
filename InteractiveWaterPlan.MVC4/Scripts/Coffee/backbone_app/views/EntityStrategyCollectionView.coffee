define([
    'namespace'
    'views/BaseStrategyCollectionView'
    'views/EntityStrategyView'
    'scripts/text!templates/entityStrategyTable.html'
],
(namespace, BaseStrategyCollectionView, EntityStrategyView, tpl) ->

    class EntityStrategyCollectionView extends BaseStrategyCollectionView
        
        initialize: (options) ->
            _.bindAll(this, 'fetchCallback', 'onFetchBothCollectionSuccess', 
                'showSourceFeatures')

            @entityId = options.id
            
            @viewName = ko.observable()

            @mapView = namespace.mapView

            fetchParams = {entityId: @entityId}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/entity" 
            )

            SourceCollection = Backbone.Collection.extend(
                url: "#{BASE_API_PATH}api/entity/#{@entityId}/sources"
            )

            @sourceCollection = new SourceCollection()

            super EntityStrategyView, 
                StrategyCollection, tpl, {fetchParams: fetchParams}

            
            return null

        #override the super's fetchCollection to also fetch sources
        fetchCollection: () ->

            this.$('tbody').empty() #clear the table contents

            #always include the current year in the fetch parameters
            params = _.extend({year: namespace.currYear }, @fetchParams)

            this.trigger("table:startload")

            #Fetch the collections
            $.when(
                @collection.fetch( {data: params} ),
                @sourceCollection.fetch()
            )
            .then(() => 
                this.onFetchBothCollectionSuccess() #process the collections
                this.trigger("table:endload")
                return
            )
            .fail(() =>
                this.trigger("table:fetcherror")
                return
            )

            return

        unrender: () ->
            if @sourceHighlightControl? then @sourceHighlightControl.destroy()
            if @sourceClickControl? then @sourceClickControl.destroy()
            if @sourceLayer? then @sourceLayer.destroy()
            return super

        onFetchBothCollectionSuccess: () ->

            #Do @collection stuff (can just use the super's callback method)
            this.onFetchCollectionSuccess(@collection)

            #Do @sourceCollection stuff
            this.showSourceFeatures()

            return

        #override the BaseStrategyCollectionView.fetchCallback
        fetchCallback: (strategyModels) ->

            #Set the viewName from the first wug
            @viewName(strategyModels[0].get("recipientEntityName"))
            
            #then call the super fetchCallback
            super strategyModels

            return

        showSourceFeatures: () ->
            #TODO: will also need to draw lines from entity to source
            #TODO: Add popup on highlight
            #TODO: can only have a single instance of select control (can't have two on two different layers)
            # see - http://openlayers.org/dev/examples/select-feature-multilayer.html
            # this is where have all the feature stuff controlled by these
            # StrategyViews would make more sense

            wktFormat = new OpenLayers.Format.WKT()

            bounds = null
            sourceFeatures = []

            for source in @sourceCollection.models
                newFeature = wktFormat.read(source.get('wktGeog'))
                newFeature.attributes = _.clone(source.attributes)
                
                #but we don't need to carry about the large wktGeog
                delete newFeature.attributes.wktGeog
                
                newFeature.geometry = @mapView.transformToWebMerc(
                    newFeature.geometry)
        
                if not bounds?
                    bounds = newFeature.geometry.getBounds().clone()
                else
                    bounds.extend(newFeature.geometry.getBounds())

                sourceFeatures.push(newFeature)

            @sourceLayer = new OpenLayers.Layer.Vector(
                "Source Feature Layer",
                {
                    displayInLayerSwitcher: false
                    styleMap: new OpenLayers.StyleMap(
                        "default" : new OpenLayers.Style( 
                            strokeColor: "cyan"
                            strokeWidth: 1
                            fillColor: "blue"
                            fillOpacity: 0.8
                        )
                        "select" : new OpenLayers.Style(
                            fillColor: "cyan"
                            strokeColor: "blue"
                        )
                    )
                }
            )
            @sourceLayer.addFeatures(sourceFeatures)

            @mapView.map.addLayer(@sourceLayer)

            ### TODO: See notes above
            @sourceHighlightControl = new OpenLayers.Control.SelectFeature(
                @sourceLayer,
                {
                    autoActivate: true
                    hover: true
                })

            @mapView.map.addControl(@sourceHighlightControl)

            #OL workaround to allow dragging while over a feature
            # see http://trac.osgeo.org/openlayers/wiki/SelectFeatureControlMapDragIssues    
            @sourceHighlightControl.handlers.feature.stopDown = false;

            @sourceClickControl = new OpenLayers.Control.SelectFeature(
                @sourceLayer,
                {
                    autoActivate: true
                    
                    clickFeature: (sourceFeature) ->
                        #else navigate to Source Details view when feature is clicked
                        sourceId = sourceFeature.attributes.sourceId
                        #TODO: navigate to source page
                        #Backbone.history.navigate("#/#{namespace.currYear}/wms/source/#{sourceId}", 
                        #    {trigger: true})
            
                        return
                })

            @mapView.map.addControl(@sourceClickControl)
            
            #OL workaround again
            @sourceClickControl.handlers.feature.stopDown = false;
            ###

            #And zoom the map to include the bounds of the sources as well
            # as the wugFeatures (should only be one)
            for wugFeat in @mapView.wugLayer
                bounds.extend(wugFeat.geometry.getBounds())
            @mapView.zoomToExtent(bounds)

            return

)