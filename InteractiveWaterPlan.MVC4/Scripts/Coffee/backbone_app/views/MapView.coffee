define([

],
() ->
    class MapView extends Backbone.View

        origCenter: new OpenLayers.LonLat(-99.294317, 31.348335).transform(
                new OpenLayers.Projection("EPSG:4326"), #geographic wgs-84
                new OpenLayers.Projection("EPSG:3857") #spherical/web mercator (aka 900913)
            )

        origZoom: 6

        map: null

        bingApiKey: 'AkcIEknNDXOC-auGjTFai2j6vXuUeC6vT2-i7_JusAghlLEOwoM1gVC0vz1AcS5o'

        baseLayers: ['mapquest_open', 'esri_gray', 'mapquest_aerial', 
            'stamen_toner', 'stamen_watercolor',
            'bing_road', 'bing_hybrid', 'bing_aerial']

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

            #@placeLayer = @placeLayer = new OpenLayers.Layer.Vector("Place Layer",
            #    {
            #        displayInLayerSwitcher: false
            #    })
            #@map.addLayer(@placeLayer)
            
            @map.addControl(new OpenLayers.Control.LayerSwitcher());

            return this

        unrender: () ->
            @$el.remove()
            return null

        initialize: (mapContainerId) ->
        
            @$el = $("##{mapContainerId}")
            @el = @$el[0]

            _.bindAll(this, 'render', 'unrender')
            
            return null

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

)
