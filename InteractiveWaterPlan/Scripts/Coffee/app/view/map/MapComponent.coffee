###
The MapComponent holds the OpenLayers map.
###

Ext.define('ISWP.view.map.MapComponent', {
    extend: 'Ext.Component'

    alias: 'widget.mapcomponent'

    map: null

    #TODO: read this from app config
    bingApiKey:'Aq7OR-oOdjT5kHB1zKYF7O55CZsiZHai_UnX3blamGr2l94e1b9YyAWOrz9NcX9N'


    handleMapEvent: (evt) ->
        map = this
        ###
        if evt.type = "moveend"
            console.log("moveend", map.getCenter().transform(
                map.projection, map.displayProjection))


        else if evt.type == 'click'
            console.log("click", map.getLonLatFromPixel(evt.xy).transform(
                map.projection, map.displayProjection
            ))
        ### 

        return null

    initializeMap: () ->
        merc_proj = new OpenLayers.Projection("EPSG:3857") #spherical mercator (aka 900913)
        wgs84_proj = new OpenLayers.Projection("EPSG:4326") #geographic wgs-84

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
        

        this.map = new OpenLayers.Map(
            div: this.id,
            projection: merc_proj, 
            displayProjection: wgs84_proj 
            layers: [mapquest_open, mapquest_aerial, bing_road, bing_hybrid, bing_aerial]
            center: new OpenLayers.LonLat(-99.294317, 31.348335).transform(wgs84_proj, merc_proj)
            zoom: 6
            eventListeners:
                moveend: this.handleMapEvent
                click: this.handleMapEvent
                updatesize: (evt) ->
                    console.log(this.size)
        )

        this.map.addControl(new OpenLayers.Control.LayerSwitcher());
        
        #return a reference to the map
        return this.map
})