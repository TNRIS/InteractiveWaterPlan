define([
    'namespace'
    'config/WmsThemeConfig'
    'views/BaseStrategyCollectionView'
    'views/EntityStrategyView'
    'scripts/text!templates/entityStrategyTable.html'
],
(namespace, WmsThemeConfig, BaseStrategyCollectionView, EntityStrategyView, tpl) ->

    class EntityStrategyCollectionView extends BaseStrategyCollectionView
        
        initialize: (options) ->
            _.bindAll(this, 'fetchCallback', 'onFetchBothCollectionSuccess', 
                'showSourceFeatures', '_registerHighlightEvents')

            @entityId = options.id
            
            @viewName = ko.observable()

            @mapView = namespace.mapView

            fetchParams = {entityId: @entityId}
            
            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_API_PATH}api/strategies/entity" 
            )

            #also need to specify ?year=currYear
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
                
                @sourceCollection.fetch(
                    data:
                        year: namespace.currYear
                )
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
            if @lineLayer? then @lineLayer.destroy()
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
            wktFormat = new OpenLayers.Format.WKT()

            bounds = null
            sourceFeatures = []
            lineFeatures = []
            wugFeature = @wugLayer.features[0]

            for source in @sourceCollection.models

                #skip sources with no geog
                if not source.get('wktGeog')? then continue

                newFeature = wktFormat.read(source.get('wktGeog'))
                if not newFeature? then continue

                newFeature.attributes = _.clone(source.attributes)

                #grab the source point for mapping  and transform from geographic to web merc
                if source.attributes.wktMappingPoint?
                    sourcePoint = wktFormat.read(source.attributes.wktMappingPoint)
                    sourcePoint.geometry = @mapView.transformToWebMerc(sourcePoint.geometry)

                    lineFeatures.push new OpenLayers.Feature.Vector(
                        new OpenLayers.Geometry.LineString([sourcePoint.geometry, wugFeature.geometry])
                    )

                #we don't need to carry about the large wktGeog
                delete newFeature.attributes.wktGeog
                delete newFeature.attributes.wktMappingPoint
                
                #transform from geographic to web merc
                newFeature.geometry = @mapView.transformToWebMerc(
                    newFeature.geometry)
        
                if not bounds?
                    bounds = newFeature.geometry.getBounds().clone()
                else
                    bounds.extend(newFeature.geometry.getBounds())

                sourceFeatures.push(newFeature)

            #create and add the sourceLayer
            @sourceLayer = new OpenLayers.Layer.Vector(
                "Source Feature Layer",
                {
                    displayInLayerSwitcher: false
                    styleMap: this._sourceStyleMap
                }
            )
            @sourceLayer.addFeatures(sourceFeatures)
            @mapView.map.addLayer(@sourceLayer)
           
            #create and add the lineLayer
            @lineLayer = new OpenLayers.Layer.Vector(
                "Lines Layer",
                {
                    displayInLayerSwitcher: false    
                }
            )
            @lineLayer.addFeatures(lineFeatures)
            @mapView.map.addLayer(@lineLayer)

            #then, make sure @wugLayer is on top
            @mapView.map.setLayerIndex(@wugLayer, 
                @mapView.map.getLayerIndex(@sourceLayer) + 1)

            this._addLayerToControl(@highlightFeatureControl, @sourceLayer)

            this._registerHighlightEvents()

            
            ### TODO: See notes above - do the same thing for click control
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
                wugFeat = @wugLayer.features[0]
                bounds.extend(wugFeat.geometry.getBounds())

                @mapView.zoomToExtent(bounds)

            return

        _registerHighlightEvents: () ->
            @highlightFeatureControl.events.register('featurehighlighted', null, (event) =>
                #only do this handler for @sourceLayer
                if event.feature.layer.id != @sourceLayer.id
                    return

                sourceFeature = event.feature

                popup = new OpenLayers.Popup.FramedCloud("sourcepopup",
                    @mapView.getMouseLonLat(),
                    null, #contentSize
                    "
                        <b>#{sourceFeature.attributes.name}</b><br/>
                        #{namespace.currYear} Supply to Water User Group: 
                        #{$.number(sourceFeature.attributes.supplyInYear)} ac-ft/yr
                    ",
                    null, #anchor
                    false, #closeBox
                    #closeBoxCallback
                ) 

                popup.autoSize = true
                sourceFeature.popup = popup
                @mapView.map.addPopup(popup)
                return
            )

            @highlightFeatureControl.events.register('featureunhighlighted', null, (event) =>
                
                #only do this handler for @sourceLayer
                if event.feature.layer.id != @sourceLayer.id
                    return

                sourceFeature = event.feature
                
                if sourceFeature.popup?
                    @mapView.map.removePopup(sourceFeature.popup)
                    sourceFeature.popup.destroy()
                    sourceFeature.popup = null
                return
            )

            return

        _sourceStyleMap: new OpenLayers.StyleMap(
            "default" : new OpenLayers.Style( 
                strokeColor: "${getStrokeColor}"
                strokeWidth: "${getStrokeWidth}"
                fillColor: "${getFillColor}"
                fillOpacity: 0.8
                {   #lookup style attributes from WmsThemeConfig
                    context:
                        getStrokeColor: (feature) ->
                            style = _.find(WmsThemeConfig.SourceStyles, (style) ->
                                return style.id == feature.attributes.sourceTypeId
                            )
                            if style? then return style.strokeColor
                            return WmsThemeConfig.SourceStyles[0].strokeColor

                        getStrokeWidth: (feature) ->
                            style = _.find(WmsThemeConfig.SourceStyles, (style) ->
                                return style.id == feature.attributes.sourceTypeId
                            )
                            if style? then return style.strokeWidth
                            return WmsThemeConfig.SourceStyles[0].strokeWidth

                        getFillColor: (feature) ->
                            style = _.find(WmsThemeConfig.SourceStyles, (style) ->
                                return style.id == feature.attributes.sourceTypeId
                            )
                            if style? then return style.fillColor
                            return WmsThemeConfig.SourceStyles[0].fillColor
                }
            )
            "select" : new OpenLayers.Style(
                fillColor: "cyan"
                strokeColor: "blue"
            )

        )

)