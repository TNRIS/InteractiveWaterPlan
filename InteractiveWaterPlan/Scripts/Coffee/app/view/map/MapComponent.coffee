###
The MapComponent holds the OpenLayers map.
###

Ext.define('ISWP.view.map.MapComponent', {
    extend: 'Ext.Component'

    alias: 'widget.mapcomponent'

    map: null
    vectorLayer: null

    #TODO: read this from app config
    bingApiKey:'Aq7OR-oOdjT5kHB1zKYF7O55CZsiZHai_UnX3blamGr2l94e1b9YyAWOrz9NcX9N'
    featureInfoControlId: null
    selectFeatureControlId: null

    #TODO: Maybe move the store here? Could use Ext.StoreManager.lookup('storeId')
    store: ''

    handleMapEvent: (evt) ->
        
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
        )

        this.map.addControl(new OpenLayers.Control.LayerSwitcher());
        
        #return a reference to the map
        return this.map


    removePopupsFromMap: () ->
        this.map.removePopup(p) for p in this.map.popups

    removeLayersFromMap: (layers) ->
        for layer in layers
            for map_lyr in this.map.getLayersByName(layer.Name)
                #use destroy as suggested at http://dev.openlayers.org/apidocs/files/OpenLayers/Map-js.html#OpenLayers.Map.removeLayer
                this.map.removeLayer(map_lyr)
                map_lyr.destroy()
        return null

    addLayersToMap: (layers) ->
        this.map.addLayers(layers)
        return null

    clearVectorLayer: () ->
        if this.selectFeatureControlId?
            ctl = this.map.getControl(this.selectFeatureControlId)
            ctl.destroy()
            this.map.removeControl(ctl)
            this.selectFeatureControlId = null

        #destroy the old vector layer
        this.vectorLayer.destroy() if this.vectorLayer?

        return null

    removeFeatureInfoControl: () ->
        if this.featureInfoControlId?
            ctl = this.map.getControl(this.featureInfoControlId)
            ctl.destroy()
            this.map.removeControl(ctl)

    setupFeatureInfoControl: (layers) ->
        #remove the old featureInfoControl
        this.removeFeatureInfoControl()

        info = new OpenLayers.Control.GetFeatureInfo({
            layers: layers
            serviceUrl: 'Feature/Info'
            title: 'Identify Features by Clicking'
            queryVisible: true
            maxFeatures: 1
            eventListeners: {

                nofeaturefound: (evt) =>
                    this.fireEvent("nofeaturefound", this, evt)
                    return null

                getfeatureinfo: (evt) =>   
                    this.fireEvent("getfeatureinfo", this, evt)
                    return null  
            }
        })

       
        this.map.addControl(info)
        info.activate()
        this.featureInfoControlId = info.id



})