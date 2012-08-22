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
        'WaterUseEntity'
    ]

    refs: [
        {
            ref: 'mainPanel'
            selector: 'mainpanel'
        }
        {
            ref: 'themeYearMapPanel'
            selector: 'themeyearmappanel'
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

    featureInfoControlId: null

    selectedYear: null
    selectedTheme: null

    init: () ->
        this.control({
            'mapcomponent': 
                boxready: (mapComp) ->
                    #This must be called once the underlying box has finished its layout
                    # or else the size will be off and the map will render incorrectly
                    mapComp.initializeMap()

                    this.selectedTheme = this.getThemeYearMapPanel().getSelectedTheme()
                        
                    this.loadThemeIntoMap(this.selectedTheme)
                    
                    return null

                nofeaturefound: (mapComp, evt) ->
                    mapComp.removePopupsFromMap()
                    return null

                getfeatureinfo: (mapComp, evt) ->
                    #remove any popups
                    mapComp.removePopupsFromMap()

                    #TODO: better processing of evt.features
                    # to make nicer looking popups
                    # Maybe define a template in the theme config
                    popupText = ""
                    popupText += ("#{prop}: #{evt.features[prop]}<br/>") for prop of evt.features
                    
                    map = mapComp.map

                    map.addPopup(
                        new OpenLayers.Popup.FramedCloud(
                            "Feature Info"
                            map.getLonLatFromPixel(evt.xy)
                            null
                            popupText
                            null
                            true
                        )
                    )
                    
                    #TODO: Find somewhere else to define the custom behavior for each layer
                    # Maybe a Theme class that implements some common interface
                    if this.selectedTheme == 'proposed-reservoirs'
                        this.getWaterUseEntityStore().load({
                            params:
                                Year: this.selectedYear
                                ReservoirId: evt.features['DB12_Id']
                            
                            callback: (records, operation, success) ->
                                wktFormat = new OpenLayers.Format.WKT()
                                vectorLayer = new OpenLayers.Layer.Vector("Users Served by Planned Reservoir")

                                relatedFeatures = []
                                for rec in records
                                    data = rec.data
                                    relatedFeatures.push(wktFormat.read(rec.data.Geography))

                                bounds = null
                                for feat in relatedFeatures
                                    feat.geometry = feat.geometry.transform(map.displayProjection, map.projection)

                                    if not bounds?
                                        bounds = feat.geometry.getBounds()
                                    else
                                        bounds.extend(feat.geometry.getBounds())

                                vectorLayer.addFeatures(relatedFeatures)
                                map.addLayer(vectorLayer)
                                #map.zoomToExtent(bounds)

                                return null
                        })

                    return null


            'button[toggleGroup=yearButtons]':
                click: (btn, evt) ->
                    this.selectedYear = btn.year

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
                    this.selectedTheme = btn.theme
                    this.loadThemeIntoMap(btn.theme)

                    #TODO: change the chart/main area based on some info in the theme
                    return null

            '#mainChart':
                render: (chart) ->
                    
                    this.selectedYear = this.getThemeYearMapPanel().getSelectedYear()
                    chart.store.load({
                        params:
                            Year: this.selectedYear
                            LocationType: 'State'
                            LocationName: 'Texas'
                    })
                    return null

        })


    loadThemeIntoMap: (themeName) ->

        #First remove all layers that are in the ThemeStore
        mapComp = this.getMapComponent()
        this.getThemeStore().each((rec) ->
            mapComp.removeLayersFromMap(rec.data.Layers)
            return true
        )

        #remove any popups
        mapComp.removePopupsFromMap()
        
        #Then request and add the new layers to the ThemeStore
        # and add them to the map
        
        this.getThemeStore().load({
            params:
                ThemeName: themeName
            scope: this #scope the callback to this controller
            callback: (records, operation, success) ->
                new_layers = []
                map = mapComp.map

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
                            new_layers.push(new_lyr)
                            
                mapComp.addLayersToMap(new_layers)
                mapComp.setupFeatureInfoControl(new_layers)
                return null
        })

        return null  

})