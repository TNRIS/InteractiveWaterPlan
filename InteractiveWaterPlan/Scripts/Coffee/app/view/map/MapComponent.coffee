Ext.define('ISWP.view.map.MapComponent', {
    extend: 'Ext.Component'

    alias: 'widget.mapcomponent'

    layout: 'fit'

    map: null

    listeners:
        render: ()->
            this.map = this.initializeMap(this.el.dom)


    initializeMap: (mapDomNode) ->
 
        mapEvent = (evt) ->
            console.log(evt)

            if evt.type == 'click'
                console.log(map.getLonLatFromPixel(evt.xy).transform(
                    map.projection, map.displayProjection
                ))


            return null

        map = new OpenLayers.Map(mapDomNode,
            projection: new OpenLayers.Projection("EPSG:900913"), #web mercator
            displayProjection: new OpenLayers.Projection("EPSG:4326") #geographic wgs-84
            eventListeners:
                #moveend: mapEvent
                click: mapEvent
        )

        map.addControl(new OpenLayers.Control.LayerSwitcher('lsDiv'));

        apiKey = 'AqShzxCh8f_yETzw_wg-d9sjHUo56Nr8q1y4J121_V00CindVyzWWXi7R1jsiQXV'

        osmap = new OpenLayers.Layer.OSM('Open Street Map')

        mapquest_open = new OpenLayers.Layer.XYZ(
            "Open MapQuest", 
            [
                "http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png"
            ],
            {
                attribution: "Tiles courtesy <a href='http://www.mapquest.com/'  target='_blank'>MapQuest</a>",
                transitionEffect: "resize"
            }
        )

        mapquest_aerial = new OpenLayers.Layer.XYZ(
            "MapQuest Aerial", 
            [
                "http://oatile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
                "http://oatile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
                "http://oatile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
                "http://oatile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png"
            ],
            {
                attribution: "Tiles courtesy <a href='http://www.mapquest.com/'  target='_blank'>MapQuest</a>",
                transitionEffect: "resize"
            }
        )

        ol_wms = new OpenLayers.Layer.WMS( "OpenLayers WMS", 
            "http://vmap0.tiles.osgeo.org/wms/vmap0",
            {layers: 'basic'} );

        road = new OpenLayers.Layer.Bing({
            name: "Bing Road",
            key: apiKey,
            type: "Road"
        });
        hybrid = new OpenLayers.Layer.Bing({
            name: "Bing Hybrid",
            key: apiKey,
            type: "AerialWithLabels"
        });
        aerial = new OpenLayers.Layer.Bing({
            name: "Bing Aerial",
            key: apiKey,
            type: "Aerial"
        });

        #map.setCenter(new OpenLayers.LonLat(-98.8769, 31.4609), 7);
        

        map.addLayers([mapquest_open, osmap, road, hybrid, aerial]);
        #map.setCenter(new OpenLayers.LonLat(-10848041.052721, 3661639.4024632), 7);  
        map.setCenter(new OpenLayers.LonLat(-98.8769, 31.4609).transform(
            map.displayProjection, map.projection), 7);

        return map
})