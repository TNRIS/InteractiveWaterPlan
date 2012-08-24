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
    wktFormat: new OpenLayers.Format.WKT
    vectorLayer: null

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
                    #remove any popups
                    mapComp.removePopupsFromMap()

                    map = mapComp.map

                    unless this.selectedTheme == 'proposed-reservoirs'
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

                    #TODO: somehow highlight the feature that was clicked
                    #if features['SQL_GEOG'] was returned from the WMS GetFeature service, then we could do this

                    #TODO: don't show a popup, instead change the main content area to display the reservoir information

                    #TODO: add a hover to the related feature points to display their info

                    #TODO: The MapComponent should probably do all this stuff and keep track of its controls
                    #TODO: Any way to update a control?
                    

                    #TODO: Reload when the year selection changes

                    #TODO: Find somewhere else to define the custom behavior for each theme and its layers
                    # Maybe a Theme class that implements some common interface
                    else
                        style = new OpenLayers.StyleMap({
                            default:
                                graphicName: 'circle'
                                pointRadius: 4
                                strokeColor: 'cyan'
                                strokeWidth: 0.5
                                fillColor: 'blue'
                                fillOpacity: 0.8
                            select: #would have to create and activate a SelectFeature control
                                pointRadius: 6
                                fillOpacity: 1
                        })

                        #clear the vector layer and its controls
                        mapComp.clearVectorLayer()

                        mapComp.vectorLayer = new OpenLayers.Layer.Vector(
                            "Planned Reservoir User Entities", 
                            {
                                styleMap: style
                            }
                        )

                        #highlight the reservoir feature
                        reservoir = evt.features[0]
                        
                        res_feat = this.wktFormat.read(reservoir.WKTGeog)
                        res_feat.geometry.transform(map.displayProjection, map.projection)
                        
                        res_feat.data = reservoir
                        delete res_feat.data['WKTGeog']

                        mapComp.vectorLayer.addFeatures(res_feat)

                        #TODO: reload when year changes
                        this.getWaterUseEntityStore().load({
                            params:
                                Year: this.selectedYear
                                forReservoirId: reservoir['Id']
                            
                            scope: this #scope to the controller
                            callback: (records, operation, success) ->
                                
                                if not records? or records.length == 0
                                    return null

                                bounds = null
                                relatedFeatures = []
                                for rec in records
                                    data = rec.data
                                    new_feat = this.wktFormat.read(rec.data.WKTGeog)
                                    new_feat.data = data
                                    new_feat.geometry = new_feat.geometry.transform(map.displayProjection, map.projection)
                                    #TODO: apply the style here instead of using the stylemap ?

                                    #Use the clicked reservoir point and the new_feat point to construct a line
                                    clickedResPoint = map.getLonLatFromPixel(evt.xy)
                                    
                                    res_feat_centroid = res_feat.geometry.getCentroid()

                                    line = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([
                                        new OpenLayers.Geometry.Point(res_feat_centroid.x, res_feat_centroid.y),
                                        new OpenLayers.Geometry.Point(new_feat.geometry.x, new_feat.geometry.y)
                                    ])) #attributes and style can be added
                                    relatedFeatures.push(line) #TODO: maybe make its own layer and stylemap

                                    if not bounds?
                                        bounds = new_feat.geometry.getBounds()
                                    else
                                        bounds.extend(new_feat.geometry.getBounds())

                                    relatedFeatures.push(new_feat)



                                mapComp.vectorLayer.addFeatures(relatedFeatures)
                                map.addLayer(mapComp.vectorLayer)
                                #map.zoomToExtent(bounds)

                                #Create a new select feature control and add it to the map.
                                #Create a new select feature control and add it to the map.
                                select = new OpenLayers.Control.SelectFeature(mapComp.vectorLayer, {
                                    hover: false #listen to clicks
                                    onSelect: (feature) ->    
                                        
                                        point = {}
                                        [point.lon, point.lat] = [feature.geometry.getCentroid().x, feature.geometry.getCentroid().y]

                                        popup = new OpenLayers.Popup.FramedCloud("featurepopup", 
                                            point,
                                            null,
                                            """
                                            <h3>#{feature.data.Name}</h3>
                                            SSUsage: #{[year, feature.data.SSUsage[year]] for year of feature.data.SSUsage}<br/>
                                            Redundant Supply: #{if feature.data.IsRedundantSupply then 'Yes' else 'No'}
                                            """,
                                            null,
                                            true,
                                            () ->
                                                select.unselect(feature)
                                                return null
                                        )
                                        feature.popup = popup
                                        map.addPopup(popup)
                                    onUnselect: (feature) ->
                                        map.removePopup(feature.popup)
                                        feature.popup.destroy()
                                        feature.popup = null
                                        return null
                                })

                                map.addControl(select);
                                mapComp.selectFeatureControlId = select.id
                                select.activate();

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

        #clear the old vector layer and its controls
        mapComp.clearVectorLayer()

        #remove the old feature info control
        mapComp.removeFeatureControl()

        #Then request and add the new layers to the ThemeStore
        # and add them to the map
        
        
        #TEST TEST TEST
        if themeName == 'water-use'
            map = mapComp.map
            this.getEntityStore().load({

                scope: this
                callback: (records, operation, success) ->

                    style = new OpenLayers.StyleMap({
                        default:
                            graphicName: 'circle'
                            pointRadius: 4
                            strokeColor: 'cyan'
                            strokeWidth: 0.5
                            fillColor: 'blue'
                            fillOpacity: 0.8
                        hover: 
                            pointRadius: 6
                            fillOpacity: 1
                    })

                    #create a new one
                    mapComp.vectorLayer = new OpenLayers.Layer.Vector(
                        "Water Users", 
                        {
                            styleMap: style
                        }
                    )

                    bounds = null
                    entity_features = []
                    for rec in records
                        data = rec.data
                        new_feat = this.wktFormat.read(rec.data.WKTGeog)
                        new_feat.data = data
                        new_feat.geometry = new_feat.geometry.transform(map.displayProjection, map.projection)
                        
                        if not bounds?
                            bounds = new_feat.geometry.getBounds()
                        else
                            bounds.extend(new_feat.geometry.getBounds())

                        entity_features.push(new_feat)

                    mapComp.vectorLayer.addFeatures(entity_features)
                    map.addLayer(mapComp.vectorLayer)
                    #map.zoomToExtent(bounds)

                    #Create a new select feature control and add it to the map.
                    select = new OpenLayers.Control.SelectFeature(mapComp.vectorLayer, {
                        hover: false #listen to clicks
                        onSelect: (feature) ->    
                            popup = new OpenLayers.Popup.FramedCloud("featurepopup", 
                                feature.geometry.getBounds().getCenterLonLat(), 
                                null,
                                """
                                <h3>#{feature.data.Name}</h3>
                                Type: #{feature.data.Type}<br/>
                                RWP: #{feature.data.RWP}<br/>
                                County: #{feature.data.County}<br/>
                                Basin: #{feature.data.Basin}<br/>
                                """,
                                null,
                                true,
                                () ->
                                    select.unselect(feature)
                                    return null
                            )
                            feature.popup = popup
                            map.addPopup(popup)
                        onUnselect: (feature) ->
                            map.removePopup(feature.popup)
                            feature.popup.destroy()
                            feature.popup = null
                            return null
                    });
                    map.addControl(select);
                    mapComp.selectFeatureControlId = select.id
                    select.activate();

                    return null
            })


            return null
        #END TEST

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
                mapComp.setupFeatureControl(new_layers)
                return null
        })

        return null  

})