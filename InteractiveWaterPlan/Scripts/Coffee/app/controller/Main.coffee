Ext.define('ISWP.controller.Main', {

    extend: 'Ext.app.Controller'

    views: [
        'chart.WaterUseChart'
        'data.MainPanel'
        'map.MapComponent'
        'map.ThemeYearMapPanel'
    ]

    stores: [
        'WaterUseData'
        'Theme'
    ]

    refs: [
        {
            ref: 'mainPanel'
            selector: 'mainpanel'
        }
        {
            ref: 'mainChart'
            selector: '#mainChart'
        }
        {
            ref: 'mainContent'
            selector: '#mainContent'
        }
        {
            ref: 'mapComponent'
            selector: 'mapcomponent'
        }
    ]


    init: () ->
        this.control({
            'mapcomponent': 
                render: (mapComp) ->
                    mapComp.map = mapComp.initializeMap(mapComp.el.dom)
                    
                    #TODO: better way to load the default theme
                    # somehow tie in with which themeButton is 'pressed'
                    this.loadThemeIntoMap('water-usage')
                    return null

            'button[toggleGroup=yearButtons]':
                click: (btn, evt) ->
                    this.getMainChart().store.load({
                        params:
                            Year: btn.year
                            LocationType: 'State'
                            LocationName: 'Texas'
                        })


                    this.getMainContent().update("Main content for #{btn.year}")

                    return null

            'button[toggleGroup=themeButtons]':
                
                click: (btn, evt) ->
                    this.loadThemeIntoMap(btn.theme)



                    #TODO: change the chart/main area based on some info in the theme
                    return null

            '#mainChart':
                render: (chart) ->
                    chart.store.load({
                        params:
                            Year: 2012
                            LocationType: 'State'
                            LocationName: 'Texas'
                    })
                    return null
        })


    loadThemeIntoMap: (themeName) ->
        controller = this
        map = this.getMapComponent().map

        #First remove all layers that are in the ThemeStore
        this.getThemeStore().each((rec) ->

            for layer in rec.data.Layers
                for map_lyr in map.getLayersByName(layer.Name)
                    #use destroy as suggested at http://dev.openlayers.org/apidocs/files/OpenLayers/Map-js.html#OpenLayers.Map.removeLayer
                    map_lyr.destroy()

            return true
        )

        #Then request and add the new layers to the ThemeStore
        # and add them to the map
        this.getThemeStore().load({
            params:
                ThemeName: themeName

            callback: (records, operation, success) ->
                if not success
                    #TODO display error message
                    return false

                for rec in records
                    for layer in rec.data.Layers
                        if layer.ServiceType == "WMS"
                            new_lyr = new OpenLayers.Layer.WMS(
                                layer.Name,
                                layer.Url,
                                {
                                    layers: layer.WMSLayerNames
                                    transparent: true
                                }
                            )

                            map.addLayer(new_lyr)

                return null
        })

        ###
        #TODO: This won't work because it creates a cross-domain ajax request
        #Need to either configure a proxy, or use server side code to get the data (as is done in GEMSS1)

        info = new OpenLayers.Control.WMSGetFeatureInfo({
            url: 'http://services.tnris.org/ArcGIS/services/TWDB_StateWaterPlan/MapServer/WMSServer'
            title: 'Indetify Features by Clicking'
            queryVisible: true
            maxFeatures: 1
            eventListeners: {
                getfeatureinfo: (evt) ->
                    geogLonLat = map.getLonLatFromPixel(evt.xy).transform(
                        map.projection, map.displayProjection)

                    console.log("text", evt.text)

                    try
                        map.addPopup(new OpenLayers.Popup.FramedCloud(
                                id: "Feature Info"
                                lonlat: geogLonLat
                                contentHTML: evt.text
                                closeBox: true
                            )
                        )
                    catch e
                        console.log(e.message)

                    return null
                    
            }

        })

        map.addControl(info)
        info.activate()
        ###

        return null
})