###
The MapComponent holds the OpenLayers map.
###

Ext.define('ISWP.view.map.MapComponent', {
    extend: 'Ext.Component'

    alias: 'widget.mapcomponent'

    map: null
    vectorLayer: null
    placeLayer: null

    #TODO: read this from app config
    bingApiKey:'Aq7OR-oOdjT5kHB1zKYF7O55CZsiZHai_UnX3blamGr2l94e1b9YyAWOrz9NcX9N'
    
    #TODO: why not just store references to the controls instead of their ids?
    featureControl: null
    selectFeatureControlId: null

    #TODO: Maybe move the store here? Could use Ext.StoreManager.lookup('storeId')
    store: ''

    origCenter: new OpenLayers.LonLat(-99.294317, 31.348335).transform(
        new OpenLayers.Projection("EPSG:4326"), #geographic wgs-84
        new OpenLayers.Projection("EPSG:3857") #spherical/web mercator (aka 900913)
    )

    origZoom: 6

    handleMapEvent: (evt) ->
        
        return null

    initializeMap: () ->
        

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
        })
        
        bing_hybrid = new OpenLayers.Layer.Bing({
            name: "Bing Hybrid",
            key: this.bingApiKey,
            type: "AerialWithLabels"
            transitionEffect: "resize"
        })

        bing_aerial = new OpenLayers.Layer.Bing({
            name: "Bing Aerial",
            key: this.bingApiKey,
            type: "Aerial"
            transitionEffect: "resize"
        })
        
        esri_gray = new OpenLayers.Layer.XYZ(
            'ESRI Gray',
            [
                'http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/${z}/${y}/${x}'
            ],
            {
                attribution: "Tiles courtesy <a href='http://www.esri.com' target='_blank'>esri</a>"
            }

        )

        arclayer = new OpenLayers.Layer.ArcGIS93Rest( "ArcGIS Server Layer",
                    "http://services.tnris.org/ArcGIS/rest/services/TWDB_StateWaterPlan/MapServer/export", 
                    {layers: "show:1,2"});
       

        this.map = new OpenLayers.Map(
            div: this.id,
            projection: new OpenLayers.Projection("EPSG:3857") #spherical/web mercator (aka 900913)
            displayProjection: new OpenLayers.Projection("EPSG:4326") #geographic wgs-84 
            layers: [esri_gray, bing_road, mapquest_open, mapquest_aerial, bing_hybrid, bing_aerial]
            center: this.origCenter
            zoom: this.origZoom
            eventListeners:
                zoomend: this.handleMapEvent
        )

        this.map.addControl(new OpenLayers.Control.LayerSwitcher());
        
        #return a reference to the map
        return this.map

    zoomToExtent: (extent) ->
        this.map.zoomToExtent(extent)
        return null

    resetExtent: () ->
        this.map.setCenter(
            this.origCenter, 
            this.origZoom)
        return null

    transformToWebMerc: (geometry) ->
        return geometry.transform(this.map.displayProjection, this.map.projection)

    removePopupsFromMap: () ->
        this.map.removePopup(p) for p in this.map.popups
        return null

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

    addPlaceLayer: (placeName, placeFeature) ->
        this.clearPlaceLayer()

        this.placeLayer = new OpenLayers.Layer.Vector(
            placeName 
            #TODO: styleMap
        )

        this.placeLayer.addFeatures(placeFeature)
        this.map.addLayer(this.placeLayer)

    clearPlaceLayer: () ->
        this.placeLayer.destroy() if this.placeLayer?
        return null

    removeFeatureControl: () ->
        if this.featureControl?
            this.featureControl.destroy()
            this.map.removeControl(this.featureControl)

    setupFeatureControl: (layers, serviceUrl) ->
        #remove the old featureControl
        this.removeFeatureControl()

        info = new OpenLayers.Control.GetFeature({
            layers: layers
            serviceUrl: serviceUrl
            title: 'Identify Features by Clicking'
            queryVisible: true
            maxFeatures: 1
            eventListeners: {

                nofeaturefound: (evt) =>
                    this.fireEvent("nofeaturefound", this, evt)
                    return null

                getfeature: (evt) =>   
                    this.fireEvent("getfeature", this, evt)
                    return null  
            }
        })

        this.map.addControl(info)
        info.activate()
        this.featureControl = info



})