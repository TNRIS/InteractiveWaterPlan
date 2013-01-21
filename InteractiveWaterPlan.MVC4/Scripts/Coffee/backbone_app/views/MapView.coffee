define([
    'namespace'
    'config/WmsThemeConfig'
],
(namespace, WmsThemeConfig) ->

    class MapView extends Backbone.View

        origCenter: new OpenLayers.LonLat(-99.294317, 31.348335).transform(
                new OpenLayers.Projection("EPSG:4326"), #geographic wgs-84
                new OpenLayers.Projection("EPSG:3857") #spherical/web mercator (aka 900913)
            )

        origZoom: 5

        map: null

        bingApiKey: ''

        baseLayers: ['esri_gray', 'mapquest_open', 'mapquest_aerial', 
            'bing_road', 'bing_hybrid', 'bing_aerial']

        MAX_WUG_RADIUS: 18
        MIN_WUG_RADIUS: 6

        initialize: (config) ->

            @$el = $("##{config.mapContainerId}")
            @el = @$el[0]

            @bingApiKey = config.bingApiKey

            _.bindAll(this, 'render', 'unrender', 'resetExtent', 'showPlaceFeature', 
                'transformToWebMerc', 'resetWugFeatures', 'clearWugFeatures',
                'selectWugFeature', 'unselectWugFeatures', '_setupWugHighlightControl',
                '_setupOverlayLayers', 'showWmsOverlayByViewType', 'hideWmsOverlays',
                'showMapLoading', 'hideMapLoading', '_setupWugClickControl',
                'highlightStratTypeWugs', 'unhighlightStratTypeWugs')
            
            namespace.wugFeatureCollection.on('reset', this.resetWugFeatures)

            return null

        render: () ->
            @$el.empty()

            @map = new OpenLayers.Map(
                div: @$el[0]
                projection: new OpenLayers.Projection("EPSG:3857") #spherical/web mercator (aka 900913)
                displayProjection: new OpenLayers.Projection("EPSG:4326") #geographic wgs-84 
                layers: this._setupBaseLayers(@baseLayers)
                center: @origCenter
                zoom: @origZoom
                eventListeners: {}
                    #zoomend: this.handleMapEvent
            )

            #Load Overlay layers from WmsThemeConfig.Layers
            this._setupOverlayLayers()

            #@placeLayer = new OpenLayers.Layer.Vector("Place Layer",
            #    displayInLayerSwitcher: false)
            #@map.addLayer(@placeLayer)
            
            @map.addControl(new OpenLayers.Control.LayerSwitcher());

            return this

        unrender: () ->
            @$el.remove()
            return null

        resetWugFeatures: (featureCollection) ->
            this.clearWugFeatures()

            if featureCollection.models.length < 1 then return

            @wugLayer = new OpenLayers.Layer.Vector(
                "Water User Groups",
                {
                    styleMap: this._wugStyleMap
                    displayInLayerSwitcher: false
                })

            wktFormat = new OpenLayers.Format.WKT()

            #Size based on source supply (need to pass source supply to model)
            max_supply = featureCollection.max((m) ->
                return m.get("totalSupply")
            ).get("totalSupply")
            
            min_supply = featureCollection.min((m) ->
                return m.get("totalSupply")
            ).get("totalSupply")
 
            bounds = null
            wugFeatures = []
            
            for m in featureCollection.models
                newFeature = wktFormat.read(m.get('wktGeog'))
                newFeature.attributes = m.attributes
                newFeature.size = this._calculateScaledValue(max_supply, min_supply, 
                    @MAX_WUG_RADIUS, @MIN_WUG_RADIUS, m.get("totalSupply"))
                delete newFeature.attributes.wktGeog
                newFeature.geometry = newFeature.geometry.transform(
                    @map.displayProjection, @map.projection)
                
                if not bounds?
                    #must clone the bounds, otherwise the feature's bounds
                    # will get modified by subsequent extends in the else condition
                    bounds = newFeature.geometry.getBounds().clone()
                else
                    bounds.extend(newFeature.geometry.getBounds())

                wugFeatures.push(newFeature)
            

            @wugLayer.addFeatures(wugFeatures)
            @map.addLayer(@wugLayer)
            
            #Add control to highlight feature and show popup on hover
            @wugHighlightControl = this._setupWugHighlightControl()
            @map.addControl(@wugHighlightControl)

            #Add control to view entity details view on click
            @wugClickControl = this._setupWugClickControl()
            @map.addControl(@wugClickControl)

            @map.zoomToExtent(bounds)
            return

        clearWugFeatures: () ->
            this.unselectWugFeatures() 
            if @wugHighlightControl? 
                @wugHighlightControl.destroy()
                @wugHighlightControl = null
            if @wugClickControl?
                @wugClickControl.destroy()
                @wugClickControl = null

            if @wugLayer? then @wugLayer.destroy()
            return

        selectWugFeature: (wugId, projId) ->
            if not @wugHighlightControl? then return

            for wugFeature in @wugLayer.features

                if wugFeature.attributes.entityId == wugId
                    @wugHighlightControl.select(wugFeature)
                    return

            return

        unselectWugFeatures: () ->
            if not @wugHighlightControl? or not @wugHighlightControl.layer.selectedFeatures? 
                return

            @wugHighlightControl.unselectAll()

            return

        hideWmsOverlays: () ->
            for layer in @map.layers
                if !layer.isBaseLayer then layer.setVisibility(false)

            return

        showWmsOverlayByViewType: (viewType) ->
            for layer in @map.getLayersBy("viewType", viewType)
                layer.setVisibility(true)
            return

        highlightStratTypeWugs: (stratTypeId) ->
            if not @wugLayer then return

            for wugFeature in @wugLayer.features
                if (wugFeature.attributes.strategyTypes? and
                    _.contains(wugFeature.attributes.strategyTypes,stratTypeId))
                        wugFeature.renderIntent = "typehighlight"
                else
                    wugFeature.renderIntent = "transparent"    

            @wugLayer.redraw()   
            return

        unhighlightStratTypeWugs: () ->
            if not @wugLayer then return

            for wugFeature in @wugLayer.features
                wugFeature.renderIntent = "default"

            @wugLayer.redraw()
            return

        _setupOverlayLayers: () ->
            for layerConfig in WmsThemeConfig.Layers
                switch layerConfig.type
                    when "WMS"
                        overlay = new OpenLayers.Layer.WMS(layerConfig.name, layerConfig.url,
                            layerConfig.service_params, layerConfig.layer_params)
                        
                        #viewType is used to toggle on/off for the different wms views    
                        overlay.viewType = layerConfig.viewType
                        
                        @map.addLayer(overlay);
                        
                    else
                        throw "Unsupported Layer Type" 

            return

        _setupWugClickControl: () ->
            control = new OpenLayers.Control.SelectFeature(
                @wugLayer,
                {
                    autoActivate: true
                    
                    clickFeature: (wugFeature) =>
                        #do nothing if wugType = WWP
                        if wugFeature.attributes.type? and wugFeature.attributes.type == "WWP"
                            return

                        #else navigate to Entity Details view when feature is clicked
                        wugId = wugFeature.attributes.entityId
                        Backbone.history.navigate("#/#{namespace.currYear}/wms/entity/#{wugId}", 
                            {trigger: true})
            
                        return
                })
            return control

        _setupWugHighlightControl: () ->
            timer = null
            control = new OpenLayers.Control.SelectFeature(
                @wugLayer,
                {
                    multiple: false
                    hover: true
                    autoActivate: true

                    overFeature: (feature) ->
                        layer = feature.layer;
                        if (this.hover)
                            if (this.highlightOnly) then this.highlight(feature);
                            else if OpenLayers.Util.indexOf(layer.selectedFeatures, feature) == -1
                                #use a slight delay to prevent windows popping up too much
                                timer = _.delay(() =>
                                    this.select(feature)
                                , 400)
                        return

                    onSelect: (wugFeature) =>
                        popup = new OpenLayers.Popup.FramedCloud("wugpopup",
                            wugFeature.geometry.getBounds().getCenterLonLat()
                            null, #contentSize
                            "
                                <b>#{wugFeature.attributes.name}</b><br/>
                                Total #{namespace.currYear} Supply: #{$.number(wugFeature.attributes.totalSupply)} ac-ft/yr
                            ",
                            null, #anchor
                            false, #closeBox
                            #closeBoxCallback
                        ) 

                        popup.autoSize = true
                        wugFeature.popup = popup
                        @map.addPopup(popup)
                        return

                    onUnselect: (wugFeature) =>
                        clearTimeout(timer)
                        if wugFeature.popup?
                            @map.removePopup(wugFeature.popup)
                            wugFeature.popup.destroy()
                            wugFeature.popup = null
                        return
                }

            )


            return control

        _calculateScaledValue: (max, min, scale_max, scale_min, val) ->
            if max == min then return scale_min

            #linearly scale the input value
            scaled_val = (scale_max - scale_min)*(val - min)/(max-min) + scale_min
            
            return scaled_val

        resetExtent: () ->
            zoom = @origZoom

            #Fix for Bing baseLayer - there is a bug in OpenLayers
            if @map.baseLayer instanceof OpenLayers.Layer.Bing
                zoom = @origZoom-1

            @map.setCenter(@origCenter, zoom);
            return

        showPlaceFeature: (placeFeature) ->
            wktFormat = new OpenLayers.Format.WKT()
            feature = wktFormat.read(placeFeature.get('wktGeog'))
            
            #convert geometry to web mercator
            this.transformToWebMerc(feature.geometry)

            bounds = feature.geometry.getBounds()
            
            @map.zoomToExtent(bounds)

            #@placeLayer.removeAllFeatures()
            #@placeLayer.addFeatures(feature)
            return

        transformToWebMerc: (geometry) ->
            return geometry.transform(@map.displayProjection, @map.projection)

        showMapLoading: () ->
            if not @$loadingOverlay?
                @$loadingOverlay = $('<div></div>')

                @$loadingOverlay.height(@$el.height()).width(@$el.width())
                
                @$loadingOverlay.addClass('mapLoadingOverlay')

                @$el.prepend(@$loadingOverlay)
            return

        hideMapLoading: () ->
            if @$loadingOverlay? 
                @$loadingOverlay.remove()
                @$loadingOverlay = null
            return

        #returns array of base layers
        _setupBaseLayers: (baseLayers) ->
            layers = []
            if not baseLayers? or baseLayers.length == 0
                throw new Error("Must specify baseLayers.")

            for layer_name in baseLayers
                switch layer_name
                    when 'mapquest_open'
                        layers.push(new OpenLayers.Layer.XYZ(
                            "MapQuest Open Street", 
                            [
                                "http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                                "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                                "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                                "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png"
                            ],
                            {
                                attribution: """Data, imagery, and map information provided by 
                                    <a href='http://www.mapquest.com' target='_blank'>MapQuest</a>, 
                                    <a href='http://www.openstreetmap.org' target='_blank'>Open Street Map</a> 
                                    and contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' 
                                    target='_blank'>CC-BY-SA</a>
                                    """
                                transitionEffect: "resize"
                                isBaseLayer: true
                            }
                        ))

                    when 'mapquest_aerial'
                        layers.push(new OpenLayers.Layer.XYZ(
                            "MapQuest Open Aerial", 
                            [
                                "http://oatile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
                                "http://oatile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
                                "http://oatile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
                                "http://oatile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png"
                            ],
                            {
                                attribution: """
                                    Tiles Courtesy of <a href='http://www.mapquest.com/'' target='_blank'>MapQuest</a>.
                                    Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency
                                    """
                                transitionEffect: "resize"
                                isBaseLayer: true
                            }
                        ))

                    when 'bing_road'
                        layers.push(new OpenLayers.Layer.Bing(
                            name: "Bing Road",
                            key: this.bingApiKey,
                            type: "Road"
                            transitionEffect: "resize"
                            isBaseLayer: true

                        ))
                    
                    when 'bing_hybrid'
                        layers.push(new OpenLayers.Layer.Bing(
                            name: "Bing Hybrid",
                            key: this.bingApiKey,
                            type: "AerialWithLabels"
                            transitionEffect: "resize"
                            isBaseLayer: true

                        ))

                    when 'bing_aerial'
                        layers.push(new OpenLayers.Layer.Bing(
                            name: "Bing Aerial",
                            key: this.bingApiKey,
                            type: "Aerial"
                            transitionEffect: "resize"
                            isBaseLayer: true
                        ))
                    
                    when 'esri_gray'
                        layers.push(new OpenLayers.Layer.XYZ(
                            'ESRI Gray',
                            [
                                'http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/${z}/${y}/${x}'
                            ],
                            {
                                attribution: "Tiles Courtesy of <a href='http://www.esri.com' target='_blank'>esri</a>"
                                isBaseLayer: true
                            }
                        ))

                    when 'stamen_toner' 
                        layers.push(new OpenLayers.Layer.Stamen(
                            "toner-lite", "Stamen Toner")
                        )

                    when 'stamen_watercolor'
                        layers.push(new OpenLayers.Layer.Stamen(
                            "watercolor", "Stamen Watercolor")
                        )


            return layers

        _wugStyleMap: new OpenLayers.StyleMap(
            "default" : new OpenLayers.Style( 
                pointRadius: '${getPointRadius}'
                strokeColor: "yellow"
                strokeWidth: 1
                fillColor: "${getFillColor}"
                fillOpacity: 0.8
                {
                    context:
                        getPointRadius: (feature) ->
                            if feature.size? then return feature.size
                            return 6

                        getFillColor: (feature) ->
                            if feature.attributes.type? and feature.attributes.type == "WWP"
                                return 'gray'
                            return 'green'
                    
                    rules: [
                        new OpenLayers.Rule({
                            maxScaleDenominator: 866688,
                            symbolizer: {
                                fontSize: "11px"
                                labelAlign: 'cb'
                                labelOutlineColor: "yellow"
                                labelOutlineWidth: 2
                                labelYOffset: 8
                                label: "${name}"
                            }        
                        })
                        new OpenLayers.Rule({
                            minScaleDenominator: 866688,
                            symbolizer: {
                                
                            }        
                        })
                    ]
                }
            )
            "select" : new OpenLayers.Style(
                fillColor: "yellow"
                strokeColor: "green"
                fillOpacity: 1
            )
            "typehighlight" : new OpenLayers.Style(
                fillColor: "blue"
                fillOpacity: 0.8
                strokeColor: "yellow"
            )
            "transparent" : new OpenLayers.Style(
                fillOpacity: 0
                strokeOpacity: 0
            )
        )

)
