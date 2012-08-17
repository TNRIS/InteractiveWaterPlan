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

    featureInfoControlId: null

    init: () ->
        this.control({
            'mapcomponent': 
                boxready: (mapComp) ->
                    #This must be called once the underlying box has finished its layout
                    # or else the size will be off and the map will render incorrectly
                    mapComp.initializeMap()
                    
                    #TODO: better way to load the default theme
                    # somehow tie in with which themeButton is 'pressed'
                    this.loadThemeIntoMap('water-use')
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

        #First remove all layers that are in the ThemeStore
        this_controller = this
        map = this.getMapComponent().map
        this.getThemeStore().each((rec) ->
            for layer in rec.data.Layers
                for map_lyr in map.getLayersByName(layer.Name)
                    #use destroy as suggested at http://dev.openlayers.org/apidocs/files/OpenLayers/Map-js.html#OpenLayers.Map.removeLayer
                    map_lyr.destroy()

            return true
        )

        #remove any popups
        map.removePopup(p) for p in map.popups

        #remove the old featureInfoControl
        if this.featureInfoControlId
            ctl = map.getControl(this.featureInfoControlId)
            ctl.destroy()
            map.removeControl(ctl)
        

        #Then request and add the new layers to the ThemeStore
        # and add them to the map
        
        this.getThemeStore().load({
            params:
                ThemeName: themeName
            scope: this #scope the callback to this controller
            callback: this.themeStoreLoadCallback
        })

    themeStoreLoadCallback: (records, operation, success) ->
        new_layers = []
        map = this.getMapComponent().map

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
                    
        map.addLayers(new_layers)

        info = new OpenLayers.Control.GetFeatureInfo({
            layers: new_layers
            serviceUrl: 'Feature/Info' #TODO: make this a parameter
            title: 'Identify Features by Clicking'
            queryVisible: true
            maxFeatures: 1
            eventListeners: {

                nofeaturefound: (evt) ->
                    #remove any popups
                    map.removePopup(p) for p in map.popups
                    return null

                getfeatureinfo: (evt) ->   
                    #remove any popups
                    map.removePopup(p) for p in map.popups

                    #TODO: better processing of evt.features
                    # to make nicer looking popups
                    # Maybe define a template in the theme config
                    popupText = ""
                    popupText += ("#{prop}: #{evt.features[prop]}<br/>") for prop of evt.features
                    
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
                    return null  
            }
        })

       
        map.addControl(info)
        info.activate()
        this.featureInfoControlId = info.id
        

        return null
})