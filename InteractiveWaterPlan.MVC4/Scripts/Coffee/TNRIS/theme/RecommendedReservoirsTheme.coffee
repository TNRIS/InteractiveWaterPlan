Ext.define('TNRIS.theme.RecommendedReservoirsTheme', {
    
    extend: 'TNRIS.theme.InteractiveTheme'
   
    max_radius: 12
    min_radius: 4

    curr_reservoir: null

    reservoirStore: null
    reservoirLayer: null

    relatedWUGLayer: null

    supplyStore: null

    featureControl: null

    selectReservoirControl: null

    #TODO: Separate the 2 views into different components

    loadTheme: () ->
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
                this.mapComp.map.addLayer(this.reservoirLayer)


                this._setupSelectReservoirControl()
                this._changeToReservoirsLayout()

                return null
        })

        return null

    unloadTheme: () ->
        this.mapComp.removePopupsFromMap()
        this._removeSelectWUGControl()
        this._removeSelectReservoirControl()

        this.reservoirLayer.destroy() if this.reservoirLayer?
        this.relatedWUGLayer.destroy() if this.relatedWUGLayer?

        this.mainContainer.removeAll(true)
        return null

    updateYear: (year) ->
        this.selectedYear = year

        this._clearRelatedEntities()

        if this.curr_reservoir?
            this._showRelatedEntities()
            
            #load the supply data store
            this.supplyStore.load({
                params:
                    ReservoirId: this.curr_reservoir.data.Id
                    Year: this.selectedYear
            })

        

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
                this._showRelatedEntities()
                this._updateSupplyStore()
                this._changeToRelatedEntitiesLayout()
                
                return null

            onUnselect: (feature) =>
                this._clearRelatedEntities()
                this._changeToReservoirsLayout()
                this.curr_reservoir = null
                return null
        })

        this.mapComp.map.addControl(this.selectReservoirControl)
        this.selectReservoirControl.activate()

        return null

    _changeToReservoirsLayout: () ->
        this.mainContainer.removeAll(true)
        
        reservoirsPanel = Ext.create('ISWP.view.theme.RecommendedReservoirsPanel', {
                reservoirStore: this.reservoirStore
                reservoirLayer: this.reservoirLayer
                mapComp: this.mapComp
            })

        this.mainContainer.add(reservoirsPanel)
        reservoirsPanel.initialize()

        reservoirsPanel.on("itemdblclick", (grid, record) =>
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
        return null

    _changeToRelatedEntitiesLayout: () ->
        this.mainContainer.removeAll(true)      

        wugPanel = Ext.create('ISWP.view.theme.RelatedWUGPanel', {
                supplyStore: this.supplyStore
                relatedWUGLayer: this.relatedWUGLayer
                relatedWUGStore: this.relatedWUGStore
                curr_reservoir: this.curr_reservoir
                mapComp: this.mapComp
            })

        this.mainContainer.add(wugPanel)
        wugPanel.initialize()

        wugPanel.on("itemdblclick", (grid, record) =>
            #unselect the previous WUG
            this.selectWUGControl.unselectAll()

            #find the matching WUG in the feature layer
            for wug_feat in this.relatedWUGLayer.features
                if record.data.Id == wug_feat.data.Id
                    #found it - selectthe matching WUG feature
                    this.selectWUGControl.select(wug_feat)
                    break  

            return null
        )

        return null

    _updateSupplyStore: () ->
        this.supplyStore.load(
            params:
                ReservoirId: this.curr_reservoir.data.Id
                Year: this.selectedYear
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

        this.relatedWUGStore.load({
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
                            Supply: #{feature.data.SourceSupply} acre-ft<br/>
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
       
    _wugStyleMap: new OpenLayers.StyleMap(
        "default" : new OpenLayers.Style( 
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
        "select" : new OpenLayers.Style(
            fillColor: "yellow"
        )
    )

})