Ext.define('ISWP.view.map.MapComponent', {
    extend: 'Ext.Component'

    alias: 'widget.mapcomponent'

    map: null
    bingApiKey:'Aq7OR-oOdjT5kHB1zKYF7O55CZsiZHai_UnX3blamGr2l94e1b9YyAWOrz9NcX9N'

    initializeMap: (mapDomNode) ->
 
        mapEvent = (evt) ->
            if evt.type = "moveend"
                console.log("moveend", map.getCenter().transform(
                    map.projection, map.displayProjection))


            else if evt.type == 'click'
                console.log("click", map.getLonLatFromPixel(evt.xy).transform(
                    map.projection, map.displayProjection
                ))

            else
                console.log(evt.type)

            return null

        map = new OpenLayers.Map(mapDomNode,
            projection: new OpenLayers.Projection("EPSG:900913"), #web mercator
            displayProjection: new OpenLayers.Projection("EPSG:4326") #geographic wgs-84
            eventListeners:
                moveend: mapEvent
                click: mapEvent
        )

        map.addControl(new OpenLayers.Control.LayerSwitcher());

        #osmap = new OpenLayers.Layer.OSM('Open Street Map')

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

        #ol_wms = new OpenLayers.Layer.WMS( "OpenLayers WMS", 
        #    "http://vmap0.tiles.osgeo.org/wms/vmap0",
        #    {layers: 'basic'} );

        ###
        
        bing_road = new OpenLayers.Layer.Bing({
            name: "Bing Road",
            key: this.bingApiKey,
            type: "Road"
            transitionEffect: "resize"
        });
        
        bing_hybrid = new OpenLayers.Layer.Bing({
            name: "Bing Hybrid",
            key: this.bingApiKey,
            type: "AerialWithLabels"
            transitionEffect: "resize"
        });

        bing_aerial = new OpenLayers.Layer.Bing({
            name: "Bing Aerial",
            key: this.bingApiKey,
            type: "Aerial"
            transitionEffect: "resize"
        });
        ###


        #http://134.125.70.3/_vetile/tile.aspx?l=852&t=${quadkey}&type=wms&refInt=15

        map.addLayers([mapquest_open, mapquest_aerial]);
        map.setCenter(new OpenLayers.LonLat(-98.9867, 32.76358).transform(
            map.displayProjection, map.projection), 6);

        proposed_reservoirs_lyr = new OpenLayers.Layer.QuadKey(
            "Proposed Reservoirs",
            "http://134.125.70.3/_vetile/tile.aspx?l=852&t=${quadkey}&type=wms&refInt=15",
            {
                isBaseLayer: false
            }
        )
        map.addLayers([proposed_reservoirs_lyr])

        return map
})