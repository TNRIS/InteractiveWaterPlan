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
        'Entity'
        'Place'
        'PlaceFeature'
        'ReservoirFeature'
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

    selectFeatureControlId: null

    selectedYear: null
    selectedTheme: null

    interactiveTheme: null

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

                getfeature: (mapComp, evt) ->
                    this.interactiveTheme.showFeatureResult(evt.features, evt.xy, this.selectedYear)
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

                    #Reload the theme with the new year
                    this.interactiveTheme.updateYear(btn.year)
                    #this.loadThemeIntoMap(this.selectedTheme)

                    return null

            'button[toggleGroup=themeButtons]':
                click: (btn, evt) ->
                    this.selectedTheme = btn.theme
                    this.loadThemeIntoMap(btn.theme)

                    #TODO: change the chart/main area based on some info in the theme
                    return null

            '#resetExtentButton':
                click: (btn, evt) ->
                    this.getMapComponent().resetExtent()
                    return null

            '#clearPlaceButton':
                click: (btn, evt) ->
                    this.getMapComponent().clearPlaceLayer()
                    return null

            '#placeCombo':
                

                select: (combo, records) ->
                    unless records.length == 1 then return null

                    selectedPlace = records[0].data

                    #Use the selectedPlace.SqlId as a parameter to 
                    # the PlaceFeature store
                    this.getPlaceFeatureStore().load({
                        params:
                            placeId: selectedPlace.SqlId
                        scope: this
                        callback: (records, operation, success) ->
                            unless success and records.length == 1 then return null
                                
                            mapComp = this.getMapComponent()

                            wktFormat = new OpenLayers.Format.WKT()
                            placeFeature = wktFormat.read(records[0].data.WKTGeog)
                            
                            #convert geometry to web mercator
                            mapComp.transformToWebMerc(placeFeature.geometry)

                            bounds = placeFeature.geometry.getBounds()
                            
                            mapComp.zoomToExtent(bounds)

                            mapComp.addPlaceLayer(selectedPlace.Name, placeFeature)

                            return null       
                    })

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
        if this.interactiveTheme? then this.interactiveTheme.unload()
        
        if themeName == 'water-use'
            this.interactiveTheme = new TNRIS.theme.WaterUsageTheme({
                mapComp: this.getMapComponent()
                themeStore: this.getThemeStore()
                themeName: themeName
                dataStore: this.getEntityStore()
                contentPanel: this.getMainContent()
            })
        else if themeName == 'proposed-reservoirs'
            this.interactiveTheme = new TNRIS.theme.ProposedReservoirsTheme({
                mapComp: this.getMapComponent()
                themeStore: this.getThemeStore()
                themeName: themeName
                dataStore: this.getWaterUseEntityStore()
                contentPanel: this.getMainContent()

                reservoirStore: this.getReservoirFeatureStore()
            })

        this.interactiveTheme.loadTheme()

        return null  

})