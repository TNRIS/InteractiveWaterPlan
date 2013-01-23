define([
    'namespace'
],
(namespace) ->
    class BaseStrategyCollectionView extends Backbone.View

        MAX_WUG_RADIUS: 18
        MIN_WUG_RADIUS: 6

        initialize: (ModelView, StrategyCollection, tpl, options) ->
            _.bindAll(this, 'render', 'unrender', 'fetchCollection', 'appendModel',
                'hideLoading', 'showLoading', 'onFetchCollectionSuccess', 
                'fetchCallback', '_setupDataTable', '_connectTableRowsToWugFeatures', 
                'showNothingFound', 'hideNothingFound',
                'showWugFeatures', 'clearWugFeaturesAndControls', '_setupWugClickControl',
                'selectWugFeature', 'unselectWugFeatures', '_setupWugHighlightControl',
                'highlightStratTypeWugs', 'unhighlightStratTypeWugs'
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

            this.fetchCollection()

            ko.applyBindings(this, @el)
            
            this.$('.has-popover').popover(
                trigger: 'hover'
                placement: 'top'
            )

            return this

        unrender: () ->
            #TODO: lots of other cleanup (all wug map stuff [layers, controls, etc])
            this.clearWugFeaturesAndControls()
            @$el.html()
            return null

        fetchCollection: () ->
            this.$('tbody').empty() #clear the table contents

            #always include the current year in the fetch parameters
            params = _.extend({year: namespace.currYear }, @fetchParams)

            this.trigger("table:startload")

            @strategyCollection.fetch(
                data: params
                
                success: this.onFetchCollectionSuccess
                    
                error: () =>
                    this.trigger("table:fetcherror")
                    return
            )

            return

        onFetchCollectionSuccess: (strategyCollection) ->
            if strategyCollection.models.length == 0
                this.trigger("table:nothingfound")

            else
                for m in strategyCollection.models
                    this.appendModel(m)

                this.$('.has-popover').popover(trigger: 'hover')

                
                this._setupDataTable()

                this._connectTableRowsToWugFeatures()

                if this.fetchCallback? and _.isFunction(this.fetchCallback)
                    this.fetchCallback(strategyCollection.models)

                this.trigger("table:endload")

            return   

        fetchCallback: (strategyModels) ->
           
            #Use some sweet underscore.js methods to
            #first group the returned strategies by ID
            # then reduce those groups to a single WUG (which will become a feature on the map)

            groupedById = _.groupBy(strategyModels, (m) ->
                return m.get("recipientEntityId")
            )

            #map to a new array, reducing each group to a single WUG
            newWugList = _.map(groupedById, 
                (group) ->
                    entity = _.reduce(group, 
                        (memo, m)->
                            
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
                if b .type == "WWP" then return 1

                #then check the supply value
                return b.totalSupply - a.totalSupply
            )
            

            #show the wugFeatures
            @wugCollection.reset(newWugList)
            this.showWugFeatures()
            return


        _mapStrategyModelToWugFeature: (m) ->
            return {
                entityId: m.get("recipientEntityId")
                name: m.get("recipientEntityName")
                wktGeog: m.get("recipientEntityWktGeog")
                totalSupply: m.get("supply#{namespace.currYear}")
                type: m.get("recipientEntityType")
                stratTypeId: m.get("typeId")
            }

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

        #############################################

        showWugFeatures: () ->
            this.clearWugFeaturesAndControls()

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
               
                newFeature.geometry = @mapView.transformToWebMerc(newFeature.geometry)

                if not bounds?
                    #must clone the bounds, otherwise the feature's bounds
                    # will get modified by subsequent extends in the else condition
                    bounds = newFeature.geometry.getBounds().clone()
                else
                    bounds.extend(newFeature.geometry.getBounds())

                wugFeatures.push(newFeature)
            

            @wugLayer.addFeatures(wugFeatures)
            @mapView.map.addLayer(@wugLayer)
            
            #TODO: make highlight and select control more generic (ie, not just wug)
            # because child of this class will have to share those controls

            #Add control to highlight feature and show popup on hover
            @wugHighlightControl = this._setupWugHighlightControl()
            @mapView.map.addControl(@wugHighlightControl)

            #Add control to view entity details view on click
            @wugClickControl = this._setupWugClickControl()
            @mapView.map.addControl(@wugClickControl)

            @mapView.zoomToExtent(bounds)
            return

        clearWugFeaturesAndControls: () ->
            this.unselectWugFeatures() 
            if @wugHighlightControl? 
                @wugHighlightControl.destroy()
                @wugHighlightControl = null
            if @wugClickControl?
                @wugClickControl.destroy()
                @wugClickControl = null

            if @wugLayer? then @wugLayer.destroy()
            return

        selectWugFeature: (wugId, projId) ->
            if not @wugHighlightControl? then return

            for wugFeature in @wugLayer.features

                if wugFeature.attributes.entityId == wugId
                    @wugHighlightControl.select(wugFeature)
                    return

            return

        unselectWugFeatures: () ->
            if not @wugHighlightControl? or not @wugHighlightControl.layer.selectedFeatures? 
                return

            @wugHighlightControl.unselectAll()

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
            control = new OpenLayers.Control.SelectFeature(
                @wugLayer,
                {
                    autoActivate: true
                    
                    clickFeature: (wugFeature) =>
                        #do nothing if wugType = WWP
                        if wugFeature.attributes.type? and wugFeature.attributes.type == "WWP"
                            return

                        #else navigate to Entity Details view when feature is clicked
                        wugId = wugFeature.attributes.entityId
                        Backbone.history.navigate("#/#{namespace.currYear}/wms/entity/#{wugId}", 
                            {trigger: true})
            
                        return
                })
            return control

        _setupWugHighlightControl: () ->
            timer = null
            control = new OpenLayers.Control.SelectFeature(
                @wugLayer,
                {
                    multiple: false
                    hover: true
                    autoActivate: true

                    overFeature: (feature) ->
                        layer = feature.layer;
                        if (this.hover)
                            if (this.highlightOnly) then this.highlight(feature);
                            else if OpenLayers.Util.indexOf(layer.selectedFeatures, feature) == -1
                                #use a slight delay to prevent windows popping up too much
                                timer = _.delay(() =>
                                    this.select(feature)
                                , 400)
                        return

                    onSelect: (wugFeature) =>
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

                    onUnselect: (wugFeature) =>
                        clearTimeout(timer)
                        if wugFeature.popup?
                            @mapView.map.removePopup(wugFeature.popup)
                            wugFeature.popup.destroy()
                            wugFeature.popup = null
                        return
                }

            )


            return control

        _calculateScaledValue: (max, min, scale_max, scale_min, val) ->
            if max == min then return scale_min

            #linearly scale the input value
            scaled_val = (scale_max - scale_min)*(val - min)/(max-min) + scale_min
            
            return scaled_val



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