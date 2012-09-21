Ext.define('TNRIS.theme.ProposedReservoirsTheme', {
    
    extend: 'TNRIS.theme.InteractiveTheme'
   
    #change the main content area to display the reservoir information

    #TODO: add a hover to the related feature points to display their info
    serviceUrl: 'api/feature/reservoir/proposed'
    max_radius: 12
    min_radius: 4

    themeName: null
    

    curr_reservoir: null

    reservoirStore: null
    reservoirLayer: null

    relatedWUGLayer: null

    gridPanel: null
    headerPanel: null

    featureControl: null

    styleMap: new OpenLayers.Style(
        pointRadius: '${getPointRadius}'
        strokeColor: '${getStrokeColor}'
        strokeWidth: '${getStrokeWidth}'
        fillColor: '${getColor}'
        fillOpacity: 0.8

        {
            context:
                getColor: (feature) ->
                    switch feature.attributes['type']
                        when 'reservoir' then return 'transparent'
                        when 'entity' then return 'green'
                        when 'line' then return 'grey' 
                    return 'red'
                getStrokeWidth: (feature) ->
                    if feature.attributes['type'] == 'reservoir'
                        return 2
                    return 0.5

                getStrokeColor: (feature) ->
                    switch feature.attributes['type']
                        when 'reservoir' then return 'blue'
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

        this.headerPanel = Ext.create('Ext.panel.Panel', {
            region: 'north'
            height: 60
            html:   """
                    <h3>Recommended Reservoirs</h3>
                    <p>Select a reservoir by clicking on one in the map or double-clicking a name below to see the water user groups that will benefit from its supply.</p>
                    """
        })
        this.contentPanel.add(this.headerPanel)

        #TODO: hook up to 'select' event select the feature for selected reservoir in the grid
        # and vice versa

        #TODO: Could use a "grouping" grid http://docs.sencha.com/ext-js/4-1/extjs-build/examples/grid/group-summary-grid.js
        this.gridPanel = Ext.create('Ext.grid.Panel', {
            store: this.reservoirStore,
            columns: [
                {text: "Name", width: 120, dataIndex: 'Name', sortable: true, hideable: false}
            ],
            forceFit: true,
            autoScroll: true
            region: 'center'
        });

        this.gridPanel.on('itemdblclick', (grid, record) =>
            
            this.curr_reservoir = record.data
            this._showReservoirAndRelatedEntities()
        )

        this.contentPanel.add(this.gridPanel)

        this.reservoirStore.load({
            scope: this
            callback: (records, operation, success) ->
                unless success then return false

                this.reservoirLayer = new OpenLayers.Layer.Vector(
                    "Recommended Reservoirs",
                    {
                        styleMap: new OpenLayers.Style(
                            {
                                pointRadius: 4
                                strokeColor: 'blue'
                                strokeWidth: 0.5
                                fillColor: 'cyan'
                                fillOpacity: 0.8
                            },
                            {
                                rules: [
                                    new OpenLayers.Rule({
                                        symbolizer: {
                                            pointRadius: 4,
                                        }
                                    }),
                                    new OpenLayers.Rule({
                                        maxScaleDenominator: 1866688,
                                        symbolizer: {
                                            fontSize: "12px"
                                            labelAlign: 'cb'
                                            labelOutlineColor: "white"
                                            labelOutlineWidth: 2
                                            labelYOffset: 6
                                            label: "${label}"
                                        }        
                                    })
                                ]
                            }
                        )
                    }
                )

                wktFormat = new OpenLayers.Format.WKT()
                res_features = []
                
                for rec in records
                    data = rec.data
                    new_feat = wktFormat.read(data.WKTGeog)

                    #TODO: This is in here because of the GeometryCollection issue with Ralph Hall and Turkey Peak
                    unless new_feat.geometry? then continue

                    this.mapComp.transformToWebMerc(new_feat.geometry)
                    
                    new_feat.attributes['label'] = data['Name']
                    res_features.push(new_feat)

                this.reservoirLayer.addFeatures(res_features)
                map.addLayer(this.reservoirLayer)

                this._setupFeatureControl(this.reservoirLayer, this.serviceUrl)
                
                return null
        })

        return null

    unloadTheme: () ->
        this.mapComp.removePopupsFromMap()
        this.mapComp.removeSelectFeatureControl()
        this._removeFeatureControl()

        this.reservoirLayer.destroy() if this.reservoirLayer?
        this.relatedWUGLayer.destroy() if this.relatedWUGLayer?

        this.contentPanel.removeAll(true)
        return null

    updateYear: (year) ->
        this.selectedYear = year

        if this.curr_reservoir?
            this._showReservoirAndRelatedEntities()
        
        return null

    _removeFeatureControl: () ->
        if this.featureControl?
            this.featureControl.destroy()
            this.mapComp.map.removeControl(this.featureControl)

    _setupFeatureControl: (layers, serviceUrl) ->
        #remove the old featureControl
        this._removeFeatureControl()

        info = new OpenLayers.Control.GetFeature({
            layers: layers
            serviceUrl: serviceUrl
            title: 'Identify Features by Clicking'
            queryVisible: true
            maxFeatures: 1
            eventListeners: {

                nofeaturefound: (evt) =>
                    this.mapComp.removePopupsFromMap()
                    return null

                getfeature: (evt) =>   
                    this.curr_reservoir = evt.features[0]
                    
                    #select the selected reservoir in the gridPanel
                    for rec in this.gridPanel.getStore().data.items
                        if this.curr_reservoir.Id == rec.data.Id
                            this.gridPanel.getSelectionModel().select(rec)

                    this._showReservoirAndRelatedEntities()

                    return null
            }
        })

        this.mapComp.map.addControl(info)
        info.activate()
        this.featureControl = info

    _showReservoirAndRelatedEntities: () ->
        map = this.mapComp.map

        #clear any popups
        this.mapComp.removePopupsFromMap()

        #clear the vector layer and its controls
        this.mapComp.removeSelectFeatureControl()
        if this.relatedWUGLayer? then this.relatedWUGLayer.destroy()
        
        #create a new vector layer
        this.relatedWUGLayer = new OpenLayers.Layer.Vector(
            'Related WUGs', 
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
        this.relatedWUGLayer.addFeatures(res_feat)


        map.addLayer(this.relatedWUGLayer)

        this.dataStore.load({
            params:
                Year: this.selectedYear
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

                this.relatedWUGLayer.addFeatures(connector_lines)
                this.relatedWUGLayer.addFeatures(related_entity_features)

                #map.zoomToExtent(bounds)

                #Create a new select feature control and add it to the map.
                #Create a new select feature control and add it to the map.
                select = new OpenLayers.Control.SelectFeature(this.relatedWUGLayer, {
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