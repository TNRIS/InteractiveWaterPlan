define([
    'namespace'
    'config/WmsThemeConfig'
    'views/BaseStrategyCollectionView'
    'views/SourceStrategyView'
    'scripts/text!templates/sourceStrategyTable.html'
],
(namespace, WmsThemeConfig, BaseStrategyCollectionView, SourceStrategyView, tpl) ->

    class SourceStrategyCollectionView extends BaseStrategyCollectionView
        
        initialize: (options) ->
            _.bindAll(this, 'onFetchBothCollectionSuccess', 
                'showSourceFeature', '_registerHighlightEvents')

            @sourceId = options.id
            
            @viewName = ko.observable()

            @mapView = namespace.mapView

            fetchParams = {sourceId: @sourceId}

            StrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_PATH}api/strategies/source" 
            )

            #Also crete a model for the source feature
            SourceModel = Backbone.Model.extend(
                url: "#{BASE_PATH}api/source/feature/#{@sourceId}"
            )

            @sourceModel = new SourceModel()

            super SourceStrategyView, StrategyCollection, tpl, {fetchParams: fetchParams}

            return

        #override the super's fetchData to also fetch the source
        fetchData: () ->
            this.$('tbody').empty() #clear the table contents

            #always include the current year in the fetch parameters
            params = _.extend({year: namespace.currYear }, @fetchParams)

            this.trigger("table:startload")

            #Fetch the collections
            $.when(
                @strategyCollection.fetch( {data: params} ),
                
                #TODO fetch the source feature collection
                @sourceModel.fetch()
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
            
            #update @viewName with the name of the source 
            @viewName(@sourceModel.attributes.name)

            #and show the feature on the map
            this.showSourceFeature()

            this.trigger("table:endload")
            return

        showSourceFeature: () ->
            
            wktFormat = new OpenLayers.Format.WKT()

            bounds = null
            
            lineFeatures = []
            wugFeatures = @wugLayer.features

            #skip sources with no geog
            if not @sourceModel.get('wktGeog')? then return

            sourceFeature = wktFormat.read(@sourceModel.get('wktGeog'))
            if not sourceFeature? then return

            sourceFeature.attributes = _.clone(@sourceModel.attributes)

            #we don't need to carry around the large wktGeog
            delete sourceFeature.attributes.wktGeog
            delete sourceFeature.attributes.wktMappingPoint
            
            #transform from geographic to web merc
            @mapView.transformToWebMerc(sourceFeature.geometry)
    
            bounds = sourceFeature.geometry.getBounds().clone()

            #iterate through wugs, and create line features, and extend the bounds
            for wugFeature in @wugLayer.features
                bounds.extend(wugFeature.geometry.getBounds())

            #iterate through the strategy models, grab the source points and wug points
            # to make connector lines
            for stratModel in @strategyCollection.models
                
                #don't draw lines for WWP entities
                if stratModel.get("recipientEntityType") == "WWP"
                    continue

                sourcePointText = stratModel.get("sourceMappingPoint")
                wugPointText = stratModel.get("recipientEntityWktGeog")
                if sourcePointText? and wugPointText?
                    sourcePoint = wktFormat.read(sourcePointText)
                    wugPoint = wktFormat.read(wugPointText)
                    @mapView.transformToWebMerc(sourcePoint.geometry)
                    @mapView.transformToWebMerc(wugPoint.geometry)
                    lineFeatures.push new OpenLayers.Feature.Vector(
                        new OpenLayers.Geometry.LineString([sourcePoint.geometry, 
                            wugPoint.geometry]), {featureType: "connector"}
                        )

            #create and add the sourceLayer
            @sourceLayer = new OpenLayers.Layer.Vector(
                "Source Feature Layer",
                {
                    displayInLayerSwitcher: false
                    styleMap: this._sourceStyleMap
                }
            )
            @sourceLayer.addFeatures(sourceFeature)
            @sourceLayer.addFeatures(lineFeatures) #put the line connector features in with the sources
            
            @mapView.map.addLayer(@sourceLayer)
        
            @mapView.map.setLayerIndex(@wugLayer, 
                +@mapView.map.getLayerIndex(@sourceLayer)+1)

            this._registerHighlightEvents()
            this._addLayerToControl(@clickFeatureControl, @sourceLayer)
            
            #And zoom the map to include the bounds of the sources as well
            # as the wugFeatures (should only be one)
            if bounds?
                wugFeat = @wugLayer.features[0]
                bounds.extend(wugFeat.geometry.getBounds())
                @mapView.zoomToExtent(bounds)
            
            return

        _registerHighlightEvents: () ->

            #first add the layer to the control
            this._addLayerToControl(@highlightFeatureControl, @sourceLayer)

            @highlightFeatureControl.events.register('beforefeaturehighlighted', null, (event) =>
                
                feature = event.feature

                #and not for connectors
                if feature.attributes.featureType? and 
                    feature.attributes.featureType == "connector"
                        return false #stops the rest of the highlight events

                return true
            )

            @highlightFeatureControl.events.register('featurehighlighted', null, (event) =>
                 
                #only do this handler for @sourceLayer
                if not event.feature.layer? or event.feature.layer.id != @sourceLayer.id
                    return false #stops the rest of the highlight events

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
                    return false #stops the rest of the highlight events

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