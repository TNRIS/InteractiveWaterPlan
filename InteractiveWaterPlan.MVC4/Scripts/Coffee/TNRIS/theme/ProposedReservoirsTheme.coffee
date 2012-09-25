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

    supplyStore: null

    gridPanel: null
    headerPanel: null

    featureControl: null

    selectReservoirControl: null

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
                {
                    text: "Name"
                    width: 120
                    dataIndex: 'Name'
                    sortable: true
                    hideable: false
                    resizable: false
                }
                {
                    xtype: 'actioncolumn'
                    width: 6
                    resizable: false
                    sortable: false
                    hideable: false
                    items: [
                        {
                            iconCls: 'icon-zoom-in'
                            tooltip: 'Zoom To'
                            handler: (grid, rowIndex, colIndex) =>
                                #Zoom to the feature when the action is clicked
                                rec = grid.getStore().getAt(rowIndex)
                                wktFormat = new OpenLayers.Format.WKT()

                                feat = wktFormat.read(rec.data.WKTGeog)

                                unless feat.geometry then return null

                                #transform to webmerc
                                this.mapComp.transformToWebMerc(feat.geometry)

                                #grab the bounds and zoom to it
                                bounds = feat.geometry.getBounds()
                                this.mapComp.map.zoomToExtent(bounds)
                                return null
                        }
                    ]
                }
            ],
            forceFit: true
            autoScroll: true
            region: 'center'
        });

        this.gridPanel.on('itemdblclick', (grid, record) =>
            
            #unselect the previous reservoir
            this.selectReservoirControl.unselectAll()

            #find the matching reservoir in the feature layer
            for res_feat in this.reservoirLayer.features
                if record.data.Id == res_feat.data.Id
                    #found it - set curr_reservoir to the matching feature
                    this.curr_reservoir = res_feat
                    break

            #select the reservoir
            this.selectReservoirControl.select(this.curr_reservoir)

            return null
        )

        this.contentPanel.add(this.gridPanel)

        this.reservoirStore.load({
            scope: this
            callback: (records, operation, success) ->
                unless success then return false

                this.reservoirLayer = new OpenLayers.Layer.Vector(
                    "Recommended Reservoirs",
                    {
                        styleMap: this._reservoirStyleMap
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
                    
                    #remove WKTGeog -- don't need to carry it around since the geometry provides it
                    delete data.WKTGeog

                    new_feat.data = data
                    new_feat.attributes['label'] = data['Name']
                    res_features.push(new_feat)

                this.reservoirLayer.addFeatures(res_features)
                map.addLayer(this.reservoirLayer)

                this._setupSelectReservoirControl()

                return null
        })

        return null

    unloadTheme: () ->
        this.mapComp.removePopupsFromMap()
        this._removeSelectWUGControl()
        this._removeSelectReservoirControl()

        this.reservoirLayer.destroy() if this.reservoirLayer?
        this.relatedWUGLayer.destroy() if this.relatedWUGLayer?

        this.contentPanel.removeAll(true)
        return null

    updateYear: (year) ->
        this.selectedYear = year

        this._clearRelatedEntities()

        if this.curr_reservoir?
            this._showRelatedEntities()
        
        return null

    _removeSelectReservoirControl: () ->
        if this.selectReservoirControl?
            this.mapComp.map.removeControl(this.selectReservoirControl)
            this.selectReservoirControl.destroy()

        return null

    _removeSelectWUGControl: () ->
        if this.selectWUGControl?
            this.mapComp.map.removeControl(this.selectWUGControl)
            this.selectWUGControl.destroy()
            
        return null

    _setupSelectReservoirControl: () ->
        #remove the old featureControl
        this._removeSelectReservoirControl()

        this.selectReservoirControl = new OpenLayers.Control.SelectFeature(this.reservoirLayer, {
            #clickout: true
            hover: false
            
            onSelect: (feature) =>
                this.curr_reservoir = feature

                for rec in this.gridPanel.getStore().data.items
                    if this.curr_reservoir.data.Id == rec.data.Id
                        this.gridPanel.getSelectionModel().select(rec)
                        break

                this._showRelatedEntities()
                this._updateSupplyChart()
                return null

            onUnselect: (feature) =>
                this._clearRelatedEntities()
                this.curr_reservoir = null
                return null
        })

        this.mapComp.map.addControl(this.selectReservoirControl)
        this.selectReservoirControl.activate()

        return null

    _updateSupplyChart: () ->
        this.supplyStore.load(
            params:
                ReservoirId: this.curr_reservoir.data.Id
                Year: this.selectedYear
            scope: this
            callback: (records, operation, success) ->
                unless success then return false

                console.log(records[0].data)
                for key of records[0].data
                    console.log("#{key} - #{records[0].data[key]}")

                return null
        )

        return null

    _clearRelatedEntities: () ->
        #clear any popups
        this.mapComp.removePopupsFromMap()

        #clear the vector layer and its controls
        this._removeSelectWUGControl()
        if this.relatedWUGLayer? then this.relatedWUGLayer.destroy()

        return null

    _showRelatedEntities: () ->
        map = this.mapComp.map
        
        #create a new vector layer
        this.relatedWUGLayer = new OpenLayers.Layer.Vector(
            'Related WUGs', 
            {
                styleMap: this._wugStyleMap
            }
        )

        map.addLayer(this.relatedWUGLayer)
        
        this.dataStore.load({
            params:
                Year: this.selectedYear
                forReservoirId: this.curr_reservoir.data.Id
            
            scope: this
            callback: (records, operation, success) ->
                
                if not records? or records.length == 0
                    return null

                related_entity_features = []
                connector_lines = []
                wktFormat = new OpenLayers.Format.WKT()

                #find the max and min source supply values
                max_supply = null
                min_supply = null
                for rec in records
                    if not max_supply? or max_supply < rec.data.SourceSupply
                        max_supply = rec.data.SourceSupply
                    
                    if not min_supply? or min_supply > rec.data.SourceSupply
                        min_supply = rec.data.SourceSupply

                
                #calculate the centroid - pass true to specify that it is a weighted calculation
                res_feat_centroid = this.curr_reservoir.geometry.getCentroid(true) 
                
                for rec in records
                    data = rec.data
                    new_feat = wktFormat.read(rec.data.WKTGeog)
                    new_feat.data = data
                    new_feat.attributes['type'] = 'entity'
                    new_feat.geometry = new_feat.geometry.transform(map.displayProjection, map.projection)
                    
                    new_feat.size = this._calculateScaledValue(
                        max_supply, min_supply, this.max_radius, this.min_radius, 
                        new_feat.data.SourceSupply)

                    
                    #Use the reservoir's centroid and the new_feat point to construct a line
                    line = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([
                        new OpenLayers.Geometry.Point(res_feat_centroid.x, res_feat_centroid.y),
                        new OpenLayers.Geometry.Point(new_feat.geometry.x, new_feat.geometry.y)
                    ])) #attributes and style can be added
                    line.attributes['type'] = 'line'
                    connector_lines.push(line) #TODO: maybe make its own layer and stylemap

                    related_entity_features.push(new_feat)

                this.relatedWUGLayer.addFeatures(connector_lines)
                this.relatedWUGLayer.addFeatures(related_entity_features)

                #Create a new select feature control and add it to the map.
                select = new OpenLayers.Control.SelectFeature(this.relatedWUGLayer, {
                    
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

                #save a reference to the control
                this.selectWUGControl = select

                map.addControl(select);
                select.activate();

                return null
        })

        return null


    _calculateScaledValue: (max, min, scale_max, scale_min, val) ->
        if max == min then return scale_min

        #linearly scale the input value
        scaled_val = (scale_max - scale_min)*(val - min)/(max-min) + scale_min
        
        return scaled_val


    _reservoirStyleMap:  new OpenLayers.StyleMap(
        "default" : new OpenLayers.Style(
            pointRadius: 4
            strokeColor: 'blue'
            strokeWidth: 0.5
            fillColor: 'cyan'
            fillOpacity: 0.8
            {
                rules: [
                    new OpenLayers.Rule({
                        symbolizer: {
                            pointRadius: 4,
                        }
                    }),
                    new OpenLayers.Rule({
                        maxScaleDenominator: 1866688,
                        symbolizer:
                            fontSize: "12px"
                            labelAlign: 'cb'
                            labelOutlineColor: "white"
                            labelOutlineWidth: 2
                            labelYOffset: 6
                            label: "${label}"
                    })
                ]
            }
        )
        "select" : new OpenLayers.Style(
            pointRadius: 5
            strokeColor: 'blue'
            strokeWidth: 2
        )
    )
       
    _wugStyleMap: new OpenLayers.Style(
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
                    if feature.attributes.type? and feature.attributes.type == 'entity'
                        return feature.size
                    return 0
        }
    )

})