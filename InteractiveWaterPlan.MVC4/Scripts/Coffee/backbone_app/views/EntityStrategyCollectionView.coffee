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
                url: "#{BASE_PATH}api/strategies/entity" 
            )

            #also need to specify ?year=currYear
            SourceCollection = Backbone.Collection.extend(
                url: "#{BASE_PATH}api/entity/#{@entityId}/sources"
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

            return

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
                    @mapView.transformToWebMerc(sourcePoint.geometry)

                    lineFeatures.push new OpenLayers.Feature.Vector(
                        new OpenLayers.Geometry.LineString([sourcePoint.geometry, wugFeature.geometry]),
                        { featureType: "connector" }
                    )

                #we don't need to carry around the large wktGeog
                delete newFeature.attributes.wktGeog
                delete newFeature.attributes.wktMappingPoint
                
                #transform from geographic to web merc
                @mapView.transformToWebMerc(newFeature.geometry)
        
                if not bounds?
                    bounds = newFeature.geometry.getBounds().clone()
                else
                    bounds.extend(newFeature.geometry.getBounds())

                sourceFeatures.push(newFeature)

            #sort the sourceFeatures so surface water are on top 
            # of everything else
            sourceFeatures.sort((a, b) ->
                
                if a.attributes.sourceType == "SURFACE WATER" then return 1
                if b.attributes.sourceType == "SURFACE WATER" then return -1

                return a.attributes.sourceTypeId - b.attributes.sourceTypeId
            )
            
            #create and add the sourceLayer
            @sourceLayer = new OpenLayers.Layer.Vector(
                "Source Feature Layer",
                {
                    displayInLayerSwitcher: false
                    styleMap: this._sourceStyleMap
                }
            )
            @sourceLayer.addFeatures(sourceFeatures)
            @sourceLayer.addFeatures(lineFeatures) #put the line connector features in with the sources
            @mapView.map.addLayer(@sourceLayer)
        
            @mapView.map.setLayerIndex(@wugLayer, 
                +@mapView.map.getLayerIndex(@sourceLayer)+1)

            
            this._registerHighlightEvents()
            this._addLayerToControl(@clickFeatureControl, @sourceLayer)
            #this._registerClickEvents() 

            #And zoom the map to include the bounds of the sources as well
            # as the wugFeatures (should only be one)
            if bounds?
                wugFeat = @wugLayer.features[0]
                bounds.extend(wugFeat.geometry.getBounds())
                @mapView.zoomToExtent(bounds)

            return

        #override the super's _clickFeature so we can also click
        # source features
        _clickFeature: (feature) ->
            super feature

            if feature.layer.id != @sourceLayer.id then return

            #don't do anything for connectors either
            if feature.attributes.featureType? and 
                feature.attributes.featureType == "connector"
                    return

            sourceId = feature.attributes.sourceId
            Backbone.history.navigate("#/#{namespace.currYear}/wms/source/#{sourceId}", 
                {trigger: true})
            return


        _registerHighlightEvents: () ->

            #first add the layer to the control
            this._addLayerToControl(@highlightFeatureControl, @sourceLayer)

            @highlightFeatureControl.events.register('beforefeaturehighlighted', null, (event) =>
                
                #only do this handler for @sourceLayer
                if not event.feature.layer? or event.feature.layer.id != @sourceLayer.id
                    return true

                feature = event.feature

                #don't do anything for connectors
                if feature.attributes.featureType? and 
                    feature.attributes.featureType == "connector"
                        return false #stops the rest of the highlight events

                return true
            )

            @highlightFeatureControl.events.register('featurehighlighted', null, (event) =>
                 
                #only do this handler for @sourceLayer
                if not event.feature.layer? or event.feature.layer.id != @sourceLayer.id
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
                if not event.feature.layer? or event.feature.layer.id != @sourceLayer.id
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
                            if feature.attributes.featureType? and 
                                feature.attributes.featureType == "connector"
                                    return "#ee9900" #orange

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