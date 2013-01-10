define([
    'namespace'
],
(namespace) ->
    class MapView extends Backbone.View

        origCenter: new OpenLayers.LonLat(-99.294317, 31.348335).transform(
                new OpenLayers.Projection("EPSG:4326"), #geographic wgs-84
                new OpenLayers.Projection("EPSG:3857") #spherical/web mercator (aka 900913)
            )

        origZoom: 5

        map: null

        bingApiKey: ''

        baseLayers: ['mapquest_open', 'mapquest_aerial', 'esri_gray', 
            'stamen_toner', 'stamen_watercolor',
            'bing_road', 'bing_hybrid', 'bing_aerial']

        MAX_WUG_RADIUS: 18
        MIN_WUG_RADIUS: 6

        initialize: (config) ->

            @$el = $("##{config.mapContainerId}")
            @el = @$el[0]

            @bingApiKey = config.bingApiKey

            _.bindAll(this, 'render', 'unrender', 'resetExtent', 'showPlaceFeature', 
                'transformToWebMerc', 'resetWugFeatures', 'clearWugFeatures')
            
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

            #State Water Plan Boundary Layer
            swp_boundaries = new OpenLayers.Layer.WMS( "Water Plan Boundaries",
                    "http://services.tnris.org/arcgis/services/swp/SWP_Boundaries/MapServer/WMSServer", 
                    {
                        layers: '0'
                        transparent: true
                    }
                    {
                        isBaseLayer: false
                        visibility: false
                        opacity: 0.7
                    })
            @map.addLayer(swp_boundaries);

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
                    bounds = newFeature.geometry.getBounds()
                else
                    bounds.extend(newFeature.geometry.getBounds())

                wugFeatures.push(newFeature)

            @wugLayer.addFeatures(wugFeatures)
            @map.addLayer(@wugLayer)
            @map.zoomToExtent(bounds)
            return


        clearWugFeatures: () ->
            if @wugLayer? then @wugLayer.destroy()
            return

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
                                ### how to do listeners on the layers: 
                                eventListeners: 
                                    'loadstart': (evt) ->
                                        console.log 'load start'

                                    'loadend': (evt) ->
                                        console.log 'ol loadend', evt
                                        return null
                                ###
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
                strokeColor: 'yellow'
                strokeWidth: '1'
                fillColor: 'green'
                fillOpacity: 0.8
                {
                    context:
                        getPointRadius: (feature) ->
                            if feature.size? then return feature.size
                            return 6
                }
            )
            "select" : new OpenLayers.Style(
                fillColor: "yellow"
                fillOpacity: 1
            )
        )

)
