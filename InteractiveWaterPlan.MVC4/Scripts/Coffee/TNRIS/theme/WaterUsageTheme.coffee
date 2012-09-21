Ext.define('TNRIS.theme.WaterUsageTheme', {
    
    extend: 'TNRIS.theme.InteractiveTheme'
   
    WUGLayer: null

    showFeatureResult: (features, clickedPoint, year) ->
        popupText = ""
        popupText += ("#{prop}: #{features[prop]}<br/>") for prop of features
        
        map.addPopup(
            new OpenLayers.Popup.FramedCloud(
                "Feature Info"
                map.getLonLatFromPixel(clickedPoint)
                null
                popupText
                null
                true
            )
        )
        return null

    loadTheme: () ->
        map = this.mapComp.map
        
        this.contentPanel.update(
            """
            <h3>Water Use</h3>
            <p>Click on a dot to view the information for that water user group.</p>
            """
        )

        this.dataStore.load({
            scope: this
            callback: (records, operation, success) ->
                unless success then return false

                #create a new vector layer
                this.WUGLayer = new OpenLayers.Layer.Vector(
                    "Water Users", 
                    {
                        styleMap: new OpenLayers.Style(
                            {
                                pointRadius: 4
                                strokeColor: 'cyan'
                                strokeWidth: 0.5
                                fillColor: 'blue'
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
                                        maxScaleDenominator: 866688,
                                        symbolizer: {
                                            fontSize: "10px"
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
                bounds = null
                entity_features = []
                for rec in records
                    data = rec.data
                    new_feat = wktFormat.read(rec.data.WKTGeog)
                    new_feat.data = data
                    new_feat.geometry = new_feat.geometry.transform(map.displayProjection, map.projection)
                    new_feat.attributes['label'] = data['Name']

                    if not bounds?
                        bounds = new_feat.geometry.getBounds()
                    else
                        bounds.extend(new_feat.geometry.getBounds())

                    entity_features.push(new_feat)

                this.WUGLayer.addFeatures(entity_features)
                map.addLayer(this.WUGLayer)
                #map.zoomToExtent(bounds)

                #Create a new select feature control and add it to the map.
                select = new OpenLayers.Control.SelectFeature(this.WUGLayer, {
                    hover: false #listen to clicks
                    onSelect: (feature) ->    
                        popup = new OpenLayers.Popup.FramedCloud("featurepopup", 
                            feature.geometry.getBounds().getCenterLonLat(), 
                            null,
                            """
                            <h3>#{feature.data.Name}</h3>
                            Planning Region: #{feature.data.RWP}<br/>
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
                this.mapComp.selectFeatureControlId = select.id
                select.activate();

                return null
        })

        return null

    unloadTheme: () ->
        this.mapComp.removePopupsFromMap()
        this.mapComp.removeSelectFeatureControl()
        this.mapComp.removeFeatureControl()

        this.WUGLayer.destroy() if this.WUGLayer?
        return null
})