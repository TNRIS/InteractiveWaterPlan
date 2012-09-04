Ext.define('TNRIS.theme.ProposedReservoirsTheme', {
    
    extend: 'TNRIS.theme.InteractiveTheme'
   
    #TODO: don't show a popup, instead change the main content area to display the reservoir information

    #TODO: add a hover to the related feature points to display their info

    max_radius: 12
    min_radius: 4

    themeName: null
    curr_reservoir: null

    layerName: 'Planned Reservoir User Entities'
    styleMap: new OpenLayers.Style(
        pointRadius: '${getPointRadius}'
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
                        when 'line' then return 'lightgrey'  
                    return 'red'
                getPointRadius: (feature) ->
                    switch feature.attributes['type']
                        when 'reservoir' then return 5
                        when 'entity' then return feature.size
                    return 0
        }
    )


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

    updateYear: (year) ->
        if this.curr_reservoir?
            this._showReservoirAndRelatedEntities(year)
        
        return null

    showFeatureResult: (features, clickedPoint, year) ->
        
        this.curr_reservoir = features[0]

        this._showReservoirAndRelatedEntities(year)

        return null


    _showReservoirAndRelatedEntities: (year) ->
        map = this.mapComp.map

        #clear any popups
        this.mapComp.removePopupsFromMap()

        #clear the vector layer and its controls
        this.mapComp.clearVectorLayer()

        #create a new vector layer
        this.mapComp.vectorLayer = new OpenLayers.Layer.Vector(
            this.layerName, 
            {
                styleMap: this.styleMap
            }
        )

        #highlight the reservoir feature
        wktFormat = new OpenLayers.Format.WKT()
        res_feat = wktFormat.read(this.curr_reservoir.WKTGeog)
        res_feat.geometry.transform(map.displayProjection, map.projection)
        
        res_feat.data = this.curr_reservoir
        res_feat.attributes['type'] = 'reservoir'
        
        #add the reservoir feature to the map
        this.mapComp.vectorLayer.addFeatures(res_feat)


        map.addLayer(this.mapComp.vectorLayer)

        #TODO: define an Ext Template or XTemplate for updating the main content area
        this.contentPanel.update("<h3>#{this.curr_reservoir.Name}: #{year}</h3>")

        
        this.dataStore.load({
            params:
                Year: year
                forReservoirId: this.curr_reservoir['Id']
            
            scope: this
            callback: (records, operation, success) ->
                if not records? or records.length == 0
                    return null

                bounds = null
                related_entity_features = []
                connector_lines = []

                #find the max and min source supply values
                max_supply = null
                min_supply = null
                for rec in records
                    if not max_supply? or max_supply < rec.data.SourceSupply
                        max_supply = rec.data.SourceSupply
                    
                    if not min_supply? or min_supply > rec.data.SourceSupply
                        min_supply = rec.data.SourceSupply

                
                for rec in records
                    data = rec.data
                    new_feat = wktFormat.read(rec.data.WKTGeog)
                    new_feat.data = data
                    new_feat.attributes['type'] = 'entity'
                    new_feat.geometry = new_feat.geometry.transform(map.displayProjection, map.projection)
                    
                    new_feat.size = this._calculateScaledValue(
                        max_supply, min_supply, this.max_radius, this.min_radius, 
                        new_feat.data.SourceSupply)

                    #TODO: apply the style here instead of using the stylemap ?

                    #Use the reservoir's centroid the new_feat point to construct a line
                    res_feat_centroid = res_feat.geometry.getCentroid()

                    line = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([
                        new OpenLayers.Geometry.Point(res_feat_centroid.x, res_feat_centroid.y),
                        new OpenLayers.Geometry.Point(new_feat.geometry.x, new_feat.geometry.y)
                    ])) #attributes and style can be added
                    line.attributes['type'] = 'line'
                    connector_lines.push(line) #TODO: maybe make its own layer and stylemap

                    if not bounds?
                        bounds = new_feat.geometry.getBounds()
                    else
                        bounds.extend(new_feat.geometry.getBounds())

                    related_entity_features.push(new_feat)

                this.mapComp.vectorLayer.addFeatures(connector_lines)
                this.mapComp.vectorLayer.addFeatures(related_entity_features)

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
                            
                            Source Supply: #{feature.data.SourceSupply} ac-ft/yr<br/>
                            Is Redundant Supply: #{feature.data.IsRedundantSupply}
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


    _calculateScaledValue: (max, min, scale_max, scale_min, val) ->
        if max == min then return scale_min

        #linearly scale the input value
        scaled_val = (scale_max - scale_min)*(val - min)/(max-min) + scale_min
        
        return scaled_val

})