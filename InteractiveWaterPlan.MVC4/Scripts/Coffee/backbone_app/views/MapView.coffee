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

        baseLayers: ['mapquest_open', 'mapquest_aerial', 'esri_gray', 
            'bing_road', 'bing_hybrid', 'bing_aerial']

        MAX_WUG_RADIUS: 18
        MIN_WUG_RADIUS: 6

        initialize: (config) ->

            @$el = $("##{config.mapContainerId}")
            @el = @$el[0]

            @bingApiKey = config.bingApiKey

            _.bindAll(this, 'render', 'unrender', 'resetExtent', 'showPlaceFeature', 
                'transformToWebMerc', 'resetWugFeatures', 'clearWugFeatures',
                'selectWugFeature', 'unselectWugFeatures', '_setupWugSelectControl')
            
            namespace.wugFeatureCollection.on('reset', this.resetWugFeatures)

            return null

        render: () ->
            @$el.empty()

            @map = new OpenLayers.Map(
                div: @$el.attr('id')
                projection: new OpenLayers.Projection("EPSG:3857") #spherical/web mercator (aka 900913)
                displayProjection: new OpenLayers.Projection("EPSG:4326") #geographic wgs-84 
                layers: this._setupBaseLayers(@baseLayers)
                center: @origCenter
                zoom: @origZoom
                eventListeners: {}
                    #zoomend: this.handleMapEvent
            )

            #Load Overlay layers from WmsThemeConfig.Layers
            for layerConfig in WmsThemeConfig.Layers
                switch layerConfig.type
                    when "WMS"
                        overlay = new OpenLayers.Layer.WMS(layerConfig.name, layerConfig.url,
                            layerConfig.service_params, layerConfig.layer_params)
                            
                        @map.addLayer(overlay);
                    else
                        throw "Unsupported Layer Type" 


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
                })

            wktFormat = new OpenLayers.Format.WKT()

            #Size based on source supply (need to pass source supply to model)
            max_supply = featureCollection.max((m) ->
                return m.get("sourceSupply")
            ).get("sourceSupply")
            
            min_supply = featureCollection.min((m) ->
                return m.get("sourceSupply")
            ).get("sourceSupply")
 
            bounds = null
            wugFeatures = []
            for m in featureCollection.models
                newFeature = wktFormat.read(m.get('wktGeog'))
                newFeature.attributes = m.attributes
                newFeature.size = this._calculateScaledValue(max_supply, min_supply, 
                    @MAX_WUG_RADIUS, @MIN_WUG_RADIUS, m.get("sourceSupply"))
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
            
            #Add a select feature on hover control
            @wugSelectControl = this._setupWugSelectControl()
            @map.addControl(@wugSelectControl)
 
            @map.zoomToExtent(bounds)
                
            return


        clearWugFeatures: () ->
            this.unselectWugFeatures() 
            if @wugSelectControl? then @wugSelectControl.destroy()
            if @wugLayer? then @wugLayer.destroy()
            return

        selectWugFeature: (wugId) ->
            if not @wugSelectControl? then return

            for wugFeature in @wugLayer.features
                if wugFeature.attributes.id == wugId
                    @wugSelectControl.select(wugFeature)
                    return

            return

        unselectWugFeatures: () ->
            if not @wugSelectControl? then return

            @wugSelectControl.unselectAll()

            return

        _setupWugSelectControl: () ->
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
                                timer = _.delay(() =>
                                    this.select(feature)
                                , 400)
                        return

                    onSelect: (wugFeature) =>
                        popup = new OpenLayers.Popup.FramedCloud("wugpopup",
                            wugFeature.geometry.getBounds().getCenterLonLat(),
                            null, #contentSize
                            "
                                <b>#{wugFeature.attributes.name}</b><br/>
                                #{namespace.currYear} Supply: #{wugFeature.attributes.sourceSupply} ac-ft/yr
                            ",
                            null, #anchor
                            false, #closeBox
                            ) #closeBoxCallback

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
                                attribution: "Tiles courtesy <a href='http://www.mapquest.com/' target='_blank'>MapQuest</a>",
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
                                attribution: "Tiles courtesy <a href='http://www.mapquest.com/' target='_blank'>MapQuest</a>",
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
                                attribution: "Tiles courtesy <a href='http://www.esri.com' target='_blank'>esri</a>"
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
                fillColor: "green"
                fillOpacity: 0.8
                {
                    context:
                        getPointRadius: (feature) ->
                            if feature.size? then return feature.size
                            return 6
                    
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
        )

)
