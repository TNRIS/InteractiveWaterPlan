define([
    'namespace'
],
(namespace) ->
    class BaseStrategyCollectionView extends Backbone.View

        MAX_WUG_RADIUS: 18
        MIN_WUG_RADIUS: 6

        initialize: (ModelView, StrategyCollection, tpl, options) ->
            _.bindAll(this, 'render', 'unrender', 'fetchData', 'appendModel',
                'hideLoading', 'showLoading', 'onFetchDataSuccess', 
                'fetchCallback', '_setupDataTable', '_connectTableRowsToWugFeatures', 
                'showNothingFound', 'hideNothingFound', '_setupClickFeatureControl',
                'showWugFeatures', '_clearWugFeaturesAndControls', '_setupWugClickControl',
                'selectWugFeature', 'unselectWugFeatures', '_setupWugHighlightContol',
                'highlightStratTypeWugs', 'unhighlightStratTypeWugs', '_setupHighlightFeatureControl'
            )

            options = options || {}
            @fetchParams = options.fetchParams || {}
            
            @mapView = namespace.mapView

            @currYear = ko.observable(namespace.currYear)

            @template = _.template(tpl)

            @strategyCollection = new StrategyCollection()

            @wugCollection = new Backbone.Collection()

            @ModelView = ModelView

            return null

        render: () ->
            @$el.html(this.template())

            this.fetchData()

            ko.applyBindings(this, @el)
            
            this.$('.has-popover').popover(
                trigger: 'hover'
                placement: 'top'
            )

            return this

        unrender: () ->
            console.log "unrender in base"
            this._clearWugFeaturesAndControls()
            @$el.html()
            return null

        _clearWugFeaturesAndControls: () ->
            this.unselectWugFeatures() 

            #TODO: maybe instead of destroying the controls, we should just 
            # remove the wug layer from them
            if @highlightFeatureControl?
                @highlightFeatureControl.destroy()
                @highlightFeatureControl = null
            if @clickFeatureControl?
                @clickFeatureControl.destroy()
                @clickFeatureControl = null


            if @wugLayer?
                @mapView.map.removeLayer(@wugLayer)
                @wugLayer.destroy()
            
            return

        fetchData: () ->
            this.$('tbody').empty() #clear the table contents

            #always include the current year in the fetch parameters
            params = _.extend({year: namespace.currYear }, @fetchParams)

            this.trigger("table:startload")

            @strategyCollection.fetch(
                data: params
                
                success: this.onFetchDataSuccess
                    
                error: () =>
                    this.trigger("table:fetcherror")
                    return
            )

            return

        onFetchDataSuccess: (strategyCollection) ->
            if strategyCollection.models.length == 0
                this.trigger("table:nothingfound")
                return false

            for m in strategyCollection.models
                this.appendModel(m)
                if m.attributes.isRedundantSupply == 'Y'
                    this.$(".note-marker-container").show()

            this.$('.has-popover').popover(trigger: 'hover')

            this._setupDataTable()

            this._connectTableRowsToWugFeatures()

            if this.fetchCallback? and _.isFunction(this.fetchCallback)
                this.fetchCallback(strategyCollection.models)

            this.trigger("table:endload")

            return true

        fetchCallback: (strategyModels) ->
           
            #Use some sweet underscore.js methods to
            #first group the returned strategies by ID
            # then reduce those groups to a single WUG (which will become a feature on the map)

            #first get rid of the WWP entities, we don't want to map them
            strategyModels = _.reject(strategyModels, (m) ->
                return m.get('recipientEntityType') == "WWP"
            )

            #then group the entities by id
            groupedById = _.groupBy(strategyModels, (m) ->
                return m.get("recipientEntityId")
            )

            #map to a new array, reducing each group to a single WUG
            # with the totalsupply summed, and the types pushed together
            newWugList = _.map(groupedById, 
                (group) ->
                    entity = _.reduce(group, 
                        (memo, m) ->
                            
                            #these properties should not change
                            memo.entityId = m.get("recipientEntityId")
                            memo.name = m.get("recipientEntityName")
                            memo.wktGeog = m.get("recipientEntityWktGeog")
                            memo.type = m.get("recipientEntityType")
                            
                            #add each type to the list of types
                            memo.strategyTypes.push(m.get("typeId"))

                            #add to the calculated total supply
                            memo.totalSupply += m.get("supply#{namespace.currYear}")

                            return memo
                        {
                            totalSupply: 0
                            strategyTypes: []
                        }
                    )

                    #make sure strategyTypes are not duplicated
                    entity.strategyTypes = _.uniq(entity.strategyTypes)
                    return entity
            )

            #Sort the features so that WWP type features are first
            # then sorty by totalSupply, largest to smallest,
            # so that the features draw appropriately (big behind small)
            newWugList.sort((a, b) ->
                #first check the type
                if a.type == "WWP" then return -1
                if b.type == "WWP" then return 1

                #then check the supply value
                return b.totalSupply - a.totalSupply
            )
            
            #show the wugFeatures
            @wugCollection.reset(newWugList)
            this.showWugFeatures()
            return

        _setupDataTable: () ->
            #grab the table, get the headers
            # for each th, grab the data-sort attribute
            # and put its value in the column config
            $table = this.$('table')
            dtColConfig = []
            $('th', $table).each((i, th) ->
                $th = $(th)
                if $th.attr('data-sort')?
                    dtColConfig.push({sType: $(th).attr('data-sort')})
                else
                    dtColConfig.push(null)
            )


            $table.dataTable(
                bDestroy: true
                sPaginationType: "bootstrap",
                aLengthMenu: [[10, 25, 50, 100, 99999], [10, 25, 50, 100, "All"]]
                aoColumns: dtColConfig
                iDisplayLength: namespace.selectedDisplayLength || 10
                #save the display length and use that on the next datatable render
                fnDrawCallback: (settings) =>
                    namespace.selectedDisplayLength = settings._iDisplayLength
                    return
            )

            return


        #Attach hover listener to the data table to show a popup for the associated WUG Feature
        _connectTableRowsToWugFeatures: () ->
            me = this #save reference to the View

            #Must use delegate methods because the table has not finished rendering
            # by the time this is called (because the models are independently appended)

            this.$('table tbody').delegate('td.strategyType', 'hover'
                (event) -> 
                    if event.type == 'mouseenter' #hoverIn
                        #trigger an event to let the map know to
                        # highlight wug features of with the strategy type
                        typeId = parseInt($(this).attr('data-type-id'))
                        me.trigger("table:hovertype", typeId)
                    
                
                    else #hover out
                        #trigger the event with null to clear type-highlighted features
                        me.trigger("table:hovertype", null)
                    return
            )

            this.$('table tbody').delegate('tr', 'hover', #delegates to tr
                (event) ->
                    if event.type == 'mouseenter'
                        $target = $(this) #this = tr

                        #grab entity-id from the parent tr
                        wugId = parseInt($target.attr('data-entity-id'))
                        
                        #trigger the event passing wugId
                        me.trigger("table:hoverwug", wugId)
                    else
                        #trigger the event passing null as the id
                        me.trigger("table:hoverwug", null)

                    return
            )

            return

        appendModel: (model) ->

            modelView = new @ModelView(
                model: model
                currYear: namespace.currYear
            )

            this.$('tbody').append(modelView.render().el)

            return

        showNothingFound: () ->
            $('#nothingFoundMessage').fadeIn()
            @$el.hide()
            return

        hideNothingFound: () ->
            $('#nothingFoundMessage').hide()
            return

        showLoading: () ->
            @$el.hide()
            this.hideNothingFound()
            $('.tableLoading').show()
            return

        hideLoading: () ->
            $('.tableLoading').hide()
            @$el.fadeIn()
            return

        showWugFeatures: () ->
            this._clearWugFeaturesAndControls()

            if @wugCollection.models.length < 1 then return

            @wugLayer = new OpenLayers.Layer.Vector(
                "Water User Groups",
                {
                    styleMap: this._wugStyleMap
                    displayInLayerSwitcher: false
                })

            wktFormat = new OpenLayers.Format.WKT()

            #Size based on source supply (need to pass source supply to model)
            max_supply = @wugCollection.max((m) ->
                return m.get("totalSupply")
            ).get("totalSupply")
            
            min_supply = @wugCollection.min((m) ->
                return m.get("totalSupply")
            ).get("totalSupply")
 
            bounds = null
            wugFeatures = []
            
            for wug in @wugCollection.models
                newFeature = wktFormat.read(wug.get("wktGeog"))
                newFeature.attributes = _.clone(wug.attributes)
                newFeature.size = this._calculateScaledValue(max_supply, min_supply, 
                    @MAX_WUG_RADIUS, @MIN_WUG_RADIUS, wug.get("totalSupply"))
                delete newFeature.attributes.wktGeog
               
                @mapView.transformToWebMerc(newFeature.geometry)

                if not bounds?
                    #must clone the bounds, otherwise the feature's bounds
                    # will get modified by subsequent extends in the else condition
                    bounds = newFeature.geometry.getBounds().clone()
                else
                    bounds.extend(newFeature.geometry.getBounds())

                wugFeatures.push(newFeature)
            

            @wugLayer.addFeatures(wugFeatures)
            @mapView.map.addLayer(@wugLayer)
            
            #Add control to highlight feature and show popup on hover
            this._setupWugHighlightContol()
           
            #Add control to view entity details view on click
            this._setupWugClickControl()
            
            @mapView.zoomToExtent(bounds)
            return

        selectWugFeature: (wugId, projId) ->
            if not @highlightFeatureControl? then return

            for wugFeature in @wugLayer.features

                if wugFeature.attributes.entityId == wugId
                    @highlightFeatureControl.select(wugFeature)
                    return

            return

        unselectWugFeatures: () ->
            if (not @highlightFeatureControl? or not @highlightFeatureControl.layer? or
                not @highlightFeatureControl.layer.selectedFeatures? )
                    return

            @highlightFeatureControl.unselectAll()

            return

        highlightStratTypeWugs: (stratTypeId) ->
            if not @wugLayer then return

            for wugFeature in @wugLayer.features
                if (wugFeature.attributes.strategyTypes? and
                    _.contains(wugFeature.attributes.strategyTypes,stratTypeId))
                        wugFeature.renderIntent = "typehighlight"
                else
                    wugFeature.renderIntent = "transparent"    

            @wugLayer.redraw()   
            return

        unhighlightStratTypeWugs: () ->
            if not @wugLayer then return

            for wugFeature in @wugLayer.features
                wugFeature.renderIntent = "default"

            @wugLayer.redraw()
            return

        _setupWugClickControl: () ->
            #first see if the control exists, if not, set it up
            if not @clickFeatureControl?
                this._setupClickFeatureControl(@wugLayer)
            #else add the wug layer to the highlight control
            else
                this._addLayerToControl(@clickFeatureControl, @wugLayer)

            #then setup event listeners
            @clickFeatureControl.events.register('clickfeature', null, (event) =>
                #only do this handler for @wugLayer
                console.log "click feature", event

                if event.cancelBubble then return

                if not event.feature.layer? or event.feature.layer.id != @wugLayer.id 
                    return

                wugFeature = event.feature

                #do nothing if wugType = WWP
                if wugFeature.attributes.type? and wugFeature.attributes.type == "WWP"
                    return

                #else navigate to Entity Details view when feature is clicked
                wugId = wugFeature.attributes.entityId
                Backbone.history.navigate("#/#{namespace.currYear}/wms/entity/#{wugId}", 
                    {trigger: true})
    
                #don't propagate the event because we're already navigating
                OpenLayers.Event.stop(event)
                return
            )

            return

        _setupWugHighlightContol: () ->
            
            #first see if the control exists, if not, set it up
            if not @highlightFeatureControl?
                this._setupHighlightFeatureControl(@wugLayer)
            #else add the wug layer to the highlight control
            else
                this._addLayerToControl(@highlightFeatureControl, @wugLayer)
                
            #then setup event listeners
            @highlightFeatureControl.events.register('featurehighlighted', null, (event) =>
                #only do this handler for @wugLayer
                if not event.feature.layer? or event.feature.layer.id != @wugLayer.id 
                    return

                wugFeature = event.feature
                popup = new OpenLayers.Popup.FramedCloud("wugpopup",
                    wugFeature.geometry.getBounds().getCenterLonLat()
                    null, #contentSize
                    "
                        <b>#{wugFeature.attributes.name}</b><br/>
                        Total #{namespace.currYear} Supply: #{$.number(wugFeature.attributes.totalSupply)} ac-ft/yr
                    ",
                    null, #anchor
                    false, #closeBox
                    #closeBoxCallback
                ) 

                popup.autoSize = true
                wugFeature.popup = popup
                @mapView.map.addPopup(popup)
                return
            )

            @highlightFeatureControl.events.register('featureunhighlighted', null, (event) =>
                
                #only do this handler for @wugLayer
                if not event.feature.layer? or event.feature.layer.id != @wugLayer.id
                    return

                wugFeature = event.feature
                
                if wugFeature.popup?
                    @mapView.map.removePopup(wugFeature.popup)
                    wugFeature.popup.destroy()
                    wugFeature.popup = null
                return
            )


            return

        _addLayerToControl: (control, newLayer) ->
            if not control? or not newLayer? then return

            oldLayers = null

            if control.layers?
                oldLayers = control.layers

            else if control.layer?
                oldLayers = [control.layer]
           
            #check to make a layer with the same id is not already in there
            alreadyThere = _.find(oldLayers, (l) ->
                return l.id == newLayer.id  
            )
            if alreadyThere? then return false

            #calling _.flatten with shallow=true will create 
            # a single dimension array layers
            control.setLayer(_.flatten([oldLayers, newLayer], true))

            return

        _setupClickFeatureControl: (layer) ->
            console.log "Setting up click feature"
            @clickFeatureControl = new OpenLayers.Control.SelectFeature(
                layer,  #an initial layer must be specified or else setLayer will cause an exception later
                {
                    autoActivate: true
                    #clickFeature: (feature) ->
                        #trigger a click feature event for listeners to subscribe to
                    #    this.events.triggerEvent("clickfeature", {feature: feature})
                    #    return

                })

            @clickFeatureControl.events.register("featurehighlighted", null, (event) ->
                this.events.triggerEvent("clickfeature", {feature: event.feature})
                return true
            )

            @mapView.map.addControl(@clickFeatureControl)

            return
       
        _setupHighlightFeatureControl: (layer) ->

            @highlightFeatureControl = new OpenLayers.Control.SelectFeature(
                layer,  #an initial layer must be specified or else setLayer will cause an exception later
                {
                    multiple: false
                    hover: true
                    autoActivate: true
                    
                    #override the default overFeature to add a timer
                    overFeature: (feature) ->
                        layer = feature.layer;
                        if (this.hover)
                            if (this.highlightOnly)
                                this.highlight(feature);
                            else if OpenLayers.Util.indexOf(layer.selectedFeatures, feature) == -1
                                #use a slight delay to prevent windows popping up too much
                                #save the timer in the control
                                this.highlightTimer = _.delay(() =>
                                    this.select(feature)
                                , 400)
                        return

                    #override the default outFeature to reset the timer
                    outFeature: (feature) ->
                        if (this.hover)
                            if (this.highlightOnly)
                                # we do nothing if we're not the last highlighter of the
                                # feature
                                if (feature._lastHighlighter == this.id)
                                    # if another select control had highlighted the feature before
                                    # we did it ourself then we use that control to highlight the
                                    # feature as it was before we highlighted it, else we just
                                    # unhighlight it
                                    if (feature._prevHighlighter and feature._prevHighlighter != this.id)
                                        delete feature._lastHighlighter
                                        control = this.map.getControl(feature._prevHighlighter)
                                        if (control) then control.highlight(feature)
                                        
                                    else
                                        this.unhighlight(feature);
                            else
                                clearTimeout(this.highlightTimer)
                                this.unselect(feature);
                }
            )

            @mapView.map.addControl(@highlightFeatureControl)

            return

        _calculateScaledValue: (max, min, scale_max, scale_min, val) ->
            if max == min then return scale_min

            #linearly scale the input value
            scaled_val = (scale_max - scale_min)*(val - min)/(max-min) + scale_min
            
            return scaled_val

        #Sweet style map for wugs
        _wugStyleMap: new OpenLayers.StyleMap(
            "default" : new OpenLayers.Style( 
                pointRadius: '${getPointRadius}'
                strokeColor: "yellow"
                strokeWidth: 1
                fillColor: "${getFillColor}"
                fillOpacity: 0.8
                {
                    context:
                        getPointRadius: (feature) ->
                            if feature.size? then return feature.size
                            return 6

                        getFillColor: (feature) ->
                            if feature.attributes.type? and feature.attributes.type == "WWP"
                                return 'gray'
                            return 'green'
                    
                    rules: [
                        new OpenLayers.Rule({
                            maxScaleDenominator: 866688,
                            symbolizer: {
                                fontSize: "11px"
                                labelAlign: 'cb'
                                labelOutlineColor: "yellow"
                                labelOutlineWidth: 2
                                labelYOffset: 8
                                label: "${name}"
                            }        
                        })
                        new OpenLayers.Rule({
                            minScaleDenominator: 866688,
                            symbolizer: {
                                
                            }        
                        })
                    ]
                }
            )
            "select" : new OpenLayers.Style(
                fillColor: "yellow"
                strokeColor: "green"
                fillOpacity: 1
            )
            "typehighlight" : new OpenLayers.Style(
                fillColor: "blue"
                fillOpacity: 0.8
                strokeColor: "yellow"
            )
            "transparent" : new OpenLayers.Style(
                fillOpacity: 0
                strokeOpacity: 0
            )
        )

)