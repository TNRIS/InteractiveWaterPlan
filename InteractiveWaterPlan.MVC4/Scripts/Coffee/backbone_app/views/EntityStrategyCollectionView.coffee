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

        #override the super's fetchData to also fetch sources
        fetchData: () ->
            this.$('tbody').empty() #clear the table contents

            #always include the current year in the fetch parameters
            params = _.extend({year: namespace.currYear }, @fetchParams)

            this.trigger("table:startload")

            #Fetch the collections
            $.when(
                @strategyCollection.fetch( {data: params} ),
                @sourceCollection.fetch()
            )
            .then(
                this.onFetchBothCollectionSuccess #process the collections
            )
            .fail(() =>
                this.trigger("table:fetcherror")
                return
            )

            return

        unrender: () ->
            #must call super first because of how controls are destroyed
            super
            if @sourceLayer? then @sourceLayer.destroy()
            return null

        onFetchBothCollectionSuccess: () ->

            #Do @strategyCollection stuff (can just use the super's callback method)
            if this.onFetchDataSuccess(@strategyCollection) == false
                return

            #only continuing if that returned non-false
            #Do @sourceCollection stuff
            this.showSourceFeatures()

            this.trigger("table:endload")
            return

        #override the BaseStrategyCollectionView.fetchCallback
        fetchCallback: (strategyModels) ->

            #Set the viewName from the first wug
            @viewName(strategyModels[0].get("recipientEntityName"))
            
            #then call the super fetchCallback
            super strategyModels

            return

        showSourceFeatures: () ->
            #TODO: will also need to draw lines from entity to source - maybe just for reservoirs and points?
            #TODO: Add popup on highlight
            #TODO: can only have a single instance of select control (can't have two on two different layers)
            
            #TODO: should probably style on type, which means we'd need the DB to return
            # the type (reservoir, well, stream, etc)
            ###
            style.addRules([
                new OpenLayers.Rule({
                    symbolizer: 
                        Line:
                            strokeWidth: 3
                            strokeOpacity: 1
                            strokeColor: "#666666"
                            strokeDashstyle: "dash"
                        #TODO: This is just here as a reminder example 
                        #for how to do feature-type-based styling
                        Polygon: 
                            strokeWidth: 2
                            strokeOpacity: 1
                            strokeColor: "#666666"
                            fillColor: "white"
                            fillOpacity: 0.3
                })
            ])
            ###

            # see - http://openlayers.org/dev/examples/select-feature-multilayer.html
            # this is where have all the feature stuff controlled by these
            # StrategyViews would make more sense

            wktFormat = new OpenLayers.Format.WKT()

            bounds = null
            sourceFeatures = []

            for source in @sourceCollection.models

                #skip sources with no geog
                if not source.get('wktGeog')? then continue

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

            this._addLayerToControl(@highlightFeatureControl, @sourceLayer)

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
            if bounds?
                for wugFeat in @wugLayer.features
                    bounds.extend(wugFeat.geometry.getBounds())

                @mapView.zoomToExtent(bounds)

            return

)