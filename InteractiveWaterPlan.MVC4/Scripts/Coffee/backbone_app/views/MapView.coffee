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

        #only zoomToExtent when isMapLocked is true 
        isMapLocked: false

        #Max Zoom Level that the map will be able to zoom to.
        MAX_ZOOM: 13

        initialize: (config) ->

            @$el = $("##{config.mapContainerId}")
            @el = @$el[0]

            @bingApiKey = config.bingApiKey

            _.bindAll(this, 'render', 'unrender', 'resetExtent', 'showPlaceFeature', 
                'transformToWebMerc',  '_setupOverlayLayers', 'showWmsOverlayByViewType', 
                'hideWmsOverlays', 'showMapLoading', 'hideMapLoading', 'zoomToExtent',
                'getMouseLonLat')
            
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
                eventListeners:
                    zoomend: (obj, el) => #enforce a max zoom level
                        currZoom = @map.getZoom()

                        #fix for Bing's zoom levels being weird
                        if @map.baseLayer instanceof OpenLayers.Layer.Bing
                            currZoom = currZoom+1

                        if (currZoom > @MAX_ZOOM)
                            @map.zoomTo(@MAX_ZOOM)
                        return
            )

            #Load Overlay layers from WmsThemeConfig.Layers
            this._setupOverlayLayers()

            #@placeLayer = new OpenLayers.Layer.Vector("Place Layer",
            #    displayInLayerSwitcher: false)
            #@map.addLayer(@placeLayer)
            
            @map.addControl(new OpenLayers.Control.LayerSwitcher());


            #setup mouse position control
            @map.addControl(new OpenLayers.Control.MousePosition(
                emptyString: ""
            ))

            return this

        unrender: () ->
            @$el.remove()
            return null

        
        hideWmsOverlays: () ->
            for layer in @map.layers
                if !layer.isBaseLayer then layer.setVisibility(false)

            return

        showWmsOverlayByViewType: (viewType) ->
            for layer in @map.layers
                if layer.viewType == viewType
                    layer.setVisibility(true)
                else if !layer.isBaseLayer
                    layer.setVisibility(false)
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
                    
                    #when "XYZ"
                    #    if layerConfig.url.indexOf("${z}") == -1 or
                    #        layerConfig.url.indexOf("${x}") == -1 or
                    #            layerConfig.url.indexOf("${y}") == -1
                    #                throw "XYZ layer must include '${z}', '${x}', and '${y}'"
                    #    overlay = new OpenLayers.Layer.XYZ(layerConfig.name, 
                    #        layerConfig.url, layerConfig.layer_params)
                    else
                        throw "Unsupported Layer Type" 

            return

        
        resetExtent: () ->
            zoom = @origZoom

            #Fix for Bing baseLayer - there is a bug in OpenLayers
            if @map.baseLayer instanceof OpenLayers.Layer.Bing
                zoom = @origZoom-1

            @map.setCenter(@origCenter, zoom);
            return

        zoomToExtent: (bounds) ->
            #only zoom if the mapView is not 'locked'
            if not @isMapLocked then @map.zoomToExtent(bounds)
            return

        showPlaceFeature: (placeFeature) ->
            wktFormat = new OpenLayers.Format.WKT()
            feature = wktFormat.read(placeFeature.get('wktGeog'))
            
            #convert geometry to web mercator
            this.transformToWebMerc(feature.geometry)

            bounds = feature.geometry.getBounds()
            
            this.zoomToExtent(bounds)

            #@placeLayer.removeAllFeatures()
            #@placeLayer.addFeatures(feature)
            return

        getMouseLonLat: () ->
            return @map.getLonLatFromPixel(
                (@map.getControlsByClass(
                    "OpenLayers.Control.MousePosition")[0])
                .lastXy)
        

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

        

)
