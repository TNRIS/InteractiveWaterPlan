#This is to prevent errors in IE when a console statement
# is in the remaining code
try
    console.log("Console is defined")
catch e
    console = {}
    console.log = () ->
        return null


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


bingApiKey = 'AkcIEknNDXOC-auGjTFai2j6vXuUeC6vT2-i7_JusAghlLEOwoM1gVC0vz1AcS5o'

bing_road = new OpenLayers.Layer.Bing({
    name: "Bing Road",
    key: bingApiKey,
    type: "Road"
    transitionEffect: "resize"
})

bing_hybrid = new OpenLayers.Layer.Bing({
    name: "Bing Hybrid",
    key: bingApiKey,
    type: "AerialWithLabels"
    transitionEffect: "resize"
})

bing_aerial = new OpenLayers.Layer.Bing({
    name: "Bing Aerial",
    key: bingApiKey,
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

toner = new OpenLayers.Layer.Stamen("toner-lite", "Stamen Toner")
watercolor = new OpenLayers.Layer.Stamen("watercolor", "Stamen Watercolor")


origCenter = new OpenLayers.LonLat(-99.294317, 31.348335).transform(
    new OpenLayers.Projection("EPSG:4326"), #geographic wgs-84
    new OpenLayers.Projection("EPSG:3857") #spherical/web mercator (aka 900913)
)

origZoom = 6

map = new OpenLayers.Map(
    div: 'mapContainer' #this.id,
    projection: new OpenLayers.Projection("EPSG:3857") #spherical/web mercator (aka 900913)
    displayProjection: new OpenLayers.Projection("EPSG:4326") #geographic wgs-84 
    layers: [esri_gray, toner, watercolor, bing_road, mapquest_open, mapquest_aerial, bing_hybrid, bing_aerial]
    center: origCenter
    zoom: origZoom
    eventListeners: {}
        #zoomend: this.handleMapEvent
)

###
this.placeLayer = this.placeLayer = new OpenLayers.Layer.Vector("Place Layer",
    {
        displayInLayerSwitcher: false
    })
this.map.addLayer(this.placeLayer)
###
map.addControl(new OpenLayers.Control.LayerSwitcher());