Ext.define('TNRIS.theme.ProposedReservoirsTheme', {
    
    extend: 'TNRIS.theme.InteractiveTheme'
   
    #TODO: don't show a popup, instead change the main content area to display the reservoir information

    #TODO: add a hover to the related feature points to display their info

    themeName: null

    loadTheme: () ->
        map = this.mapComp.map
        this.mapComp.removePopupsFromMap()
        this.mapComp.clearVectorLayer()
        this.mapComp.removeFeatureControl()

        this.contentPanel.update(
            """
            <h3>Proposed Reservoirs</h3>
            <p>Click on a reservoir to see the water user groups that will benefit from its supply.</p>
            """
        )


        this.themeStore.load({
            params:
                ThemeName: this.themeName
            scope: this #scope the callback to this controller
            callback: (records, operation, success) ->
                new_layers = []
                
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
                            
                this.mapComp.addLayersToMap(new_layers)
                this.mapComp.setupFeatureControl(new_layers)
                return null
        })

        return null


    showFeatureResult: (features, clickedPoint, year) ->
        map = this.mapComp.map

        #clear any popups
        this.mapComp.removePopupsFromMap()

        #clear the vector layer and its controls
        this.mapComp.clearVectorLayer()

        #create a new vector layer
        this.mapComp.vectorLayer = new OpenLayers.Layer.Vector(
            "Planned Reservoir User Entities", 
            {
                styleMap: new OpenLayers.Style(

                    pointRadius: 4
                    strokeColor: '${getStrokeColor}'
                    strokeWidth: 0.5
                    fillColor: '${getColor}'
                    fillOpacity: 0.8

                    {
                        context:
                            getColor: (feature) ->
                                switch feature.attributes['type']
                                    when 'reservoir' then return 'blue'
                                    when 'entity' then return 'green'
                                    when 'line' then return 'grey' 
                                return 'red'
                            getStrokeColor: (feature) ->
                                switch feature.attributes['type']
                                    when 'reservoir' then return 'cyan'
                                    when 'entity' then return 'lime'
                                    when 'line' then return 'grey'  
                                return 'red'
                    }
                )
            }
        )

        #highlight the reservoir feature
        reservoir = features[0]
        
        wktFormat = new OpenLayers.Format.WKT()
        res_feat = wktFormat.read(reservoir.WKTGeog)
        res_feat.geometry.transform(map.displayProjection, map.projection)
        
        res_feat.data = reservoir
        res_feat.attributes['type'] = 'reservoir'
        delete res_feat.data['WKTGeog'] #remove it so we don't show it in the info popup

        #TODO: define an Ext Template or XTemplate for updating the main content area
        this.contentPanel.update("<h3>#{res_feat.data.Name}: #{year}</h3>")

        #TODO: figure out how to update the chart

        this.mapComp.vectorLayer.addFeatures(res_feat)

        this.dataStore.load({
            params:
                Year: year
                forReservoirId: reservoir['Id']
            
            scope: this
            callback: (records, operation, success) ->
                
                if not records? or records.length == 0
                    return null

                bounds = null
                relatedFeatures = []
                for rec in records
                    data = rec.data
                    new_feat = wktFormat.read(rec.data.WKTGeog)
                    new_feat.data = data
                    new_feat.attributes['type'] = 'entity'
                    new_feat.geometry = new_feat.geometry.transform(map.displayProjection, map.projection)
                    #TODO: apply the style here instead of using the stylemap ?

                    #Use the clicked reservoir point and the new_feat point to construct a line
                    clickedResPoint = map.getLonLatFromPixel(clickedPoint)
                    
                    res_feat_centroid = res_feat.geometry.getCentroid()

                    line = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([
                        new OpenLayers.Geometry.Point(res_feat_centroid.x, res_feat_centroid.y),
                        new OpenLayers.Geometry.Point(new_feat.geometry.x, new_feat.geometry.y)
                    ])) #attributes and style can be added
                    line.attributes['type'] = 'line'
                    relatedFeatures.push(line) #TODO: maybe make its own layer and stylemap

                    if not bounds?
                        bounds = new_feat.geometry.getBounds()
                    else
                        bounds.extend(new_feat.geometry.getBounds())

                    relatedFeatures.push(new_feat)

                this.mapComp.vectorLayer.addFeatures(relatedFeatures)
                map.addLayer(this.mapComp.vectorLayer)
                #map.zoomToExtent(bounds)

                #Create a new select feature control and add it to the map.
                #Create a new select feature control and add it to the map.
                select = new OpenLayers.Control.SelectFeature(this.mapComp.vectorLayer, {
                    hover: false #listen to clicks, not to hover
                    onSelect: (feature) ->    
                        if not feature.data.Name then return false

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
                        return null

                    onUnselect: (feature) ->
                        if feature.popup
                            map.removePopup(feature.popup)
                            feature.popup.destroy()
                            feature.popup = null
                        return null
                })

                map.addControl(select);
                this.mapComp.selectFeatureControlId = select.id
                select.activate();

                return null
        })

        return null

})