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

        render: () ->
            @$el.empty()


            @map = new OpenLayers.Map(
                div: @$el.attr('id')
                projection: new OpenLayers.Projection("EPSG:3857") #spherical/web mercator (aka 900913)
                displayProjection: new OpenLayers.Projection("EPSG:4326") #geographic wgs-84 
                layers: this._setupBaseLayers()
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
        _setupBaseLayers: () ->
            baseLayers = []

            esri_gray = new OpenLayers.Layer.XYZ(
                'ESRI Gray',
                [
                    'http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/${z}/${y}/${x}'
                ],
                {
                    attribution: "Tiles courtesy <a href='http://www.esri.com' target='_blank'>esri</a>"
                }

            )
            baseLayers.push(esri_gray)

            mapquest_open = new OpenLayers.Layer.XYZ(
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
                }
            )
            baseLayers.push(mapquest_open)

            mapquest_aerial = new OpenLayers.Layer.XYZ(
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
                }
            )
            baseLayers.push(mapquest_aerial)

            
            bing_road = new OpenLayers.Layer.Bing({
                name: "Bing Road",
                key: @bingApiKey,
                type: "Road"
                transitionEffect: "resize"
            })

            bing_hybrid = new OpenLayers.Layer.Bing({
                name: "Bing Hybrid",
                key: @bingApiKey,
                type: "AerialWithLabels"
                transitionEffect: "resize"
            })

            bing_aerial = new OpenLayers.Layer.Bing({
                name: "Bing Aerial",
                key: @bingApiKey,
                type: "Aerial"
                transitionEffect: "resize"
            })

            baseLayers.push(bing_road, bing_hybrid, bing_aerial)
            
            toner = new OpenLayers.Layer.Stamen("toner-lite", "Stamen Toner")
            watercolor = new OpenLayers.Layer.Stamen("watercolor", "Stamen Watercolor")

            baseLayers.push(toner, watercolor)

            return baseLayers

)
