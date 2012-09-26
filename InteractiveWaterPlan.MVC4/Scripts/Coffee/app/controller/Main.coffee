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
        'ReservoirSupplyData'
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
            ref: 'mainPanel'
            selector: '#mainPanel'
        }
        {
            ref: 'mapComponent'
            selector: 'mapcomponent'
        }
        {
            ref: 'placeCombo'
            selector: '#placeCombo'
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
                        
                    #set the default selectedYear
                    this.selectedYear = this.getThemeYearMapPanel().getSelectedYear()

                    this.loadThemeIntoMap(this.selectedTheme)
                    
                    return null

            'button[toggleGroup=yearButtons]':
                click: (btn, evt) ->
                    this.selectedYear = btn.year
                    #Reload the theme with the new year
                    this.interactiveTheme.updateYear(btn.year)
                    return null

            'button[toggleGroup=themeButtons]':
                click: (btn, evt) ->
                    this.selectedTheme = btn.theme
                    this.loadThemeIntoMap(btn.theme)
                    return null

            '#resetExtentButton':
                click: (btn, evt) ->
                    this.getMapComponent().resetExtent()
                    return null

            '#clearPlaceButton':
                click: (btn, evt) ->
                    this.getPlaceCombo().clearValue()
                    this.getMapComponent().clearPlaceFeature()
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

                            mapComp.setPlaceFeature(selectedPlace.Name, placeFeature)

                            return null       
                    })

                    return null
        })
        
    loadThemeIntoMap: (themeName) ->
        
        #First unload the them
        this.interactiveTheme.unload() if this.interactiveTheme?
        
        if themeName == 'water-use'
            this.interactiveTheme = new TNRIS.theme.WaterUsageTheme({
                mapComp: this.getMapComponent()
                themeStore: this.getThemeStore()
                dataStore: this.getEntityStore()
                selectedYear: this.selectedYear
                mainPanel: this.getMainPanel()
            })
        else if themeName == 'proposed-reservoirs'
            console.log("#{this.selectedYear}")
            this.interactiveTheme = new TNRIS.theme.ProposedReservoirsTheme({
                mapComp: this.getMapComponent()
                themeStore: this.getThemeStore()
                dataStore: this.getWaterUseEntityStore()
                mainPanel: this.getMainPanel()
                selectedYear: this.selectedYear
                reservoirStore: this.getReservoirFeatureStore()
                supplyStore: this.getReservoirSupplyDataStore()
            })

        this.interactiveTheme.loadTheme()

        return null  

})