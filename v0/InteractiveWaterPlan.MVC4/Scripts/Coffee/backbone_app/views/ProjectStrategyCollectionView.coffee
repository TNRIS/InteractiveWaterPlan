define([
    'namespace'
    'views/BaseStrategyCollectionView'
    'views/ProjectStrategyView'
    'scripts/text!templates/projectStrategyTable.html'
],
(namespace, BaseStrategyCollectionView, ProjectStrategyView, tpl) ->

    #TODO: Lots of code duplicated in here from EntityStrategyCollectionView
    # with regards to the source feature layer.  Refactor these two classes
    # to share that code through a base class.
    
    class ProjectStrategyCollectionView extends BaseStrategyCollectionView
        
        initialize: (options) ->
            _.bindAll(this, 'fetchCallback', 'onFetchBothCollectionSuccess', 
                'showSourceFeatures', '_registerHighlightEvents', '_clickFeature')

            @projectId = options.id
           
            @viewName = ko.observable()

            fetchParams = {projectId: @projectId}
            
            ProjectStrategyCollection = Backbone.Collection.extend(  
                url: "#{BASE_PATH}api/strategies/project" 
            )

            #also need to specify ?year=currYear
            SourceCollection = Backbone.Collection.extend(
                url: "#{BASE_PATH}api/project/#{@projectId}/sources"
            )

            @sourceCollection = new SourceCollection()


            super ProjectStrategyView, 
                ProjectStrategyCollection, tpl, {fetchParams: fetchParams}

            return null

        #override the super's fetchData to also fetch sources
        fetchData: () ->
            this.$('tbody').empty() #clear the table contents

            #always include the current year in the fetch parameters
            params = _.extend({year: namespace.currYear }, @fetchParams)

            this.trigger("table:startload")

            #Fetch the collections
            $.when(
                @strategyCollection.fetch( {data: params} ),
                
                @sourceCollection.fetch(
                    data:
                        year: namespace.currYear
                )
            )
            .then(
                this.onFetchBothCollectionSuccess #process the collections
            )
            .fail(() =>
                this.trigger("table:fetcherror")
                return
            )

            return

        unrender: () ->
            #must call super first because of how controls are destroyed
            super

            if @sourceLayer? then @sourceLayer.destroy()

            return

        onFetchBothCollectionSuccess: () ->

            #Do @strategyCollection stuff (can just use the super's callback method)
            if this.onFetchDataSuccess(@strategyCollection) == false
                return

            #only continuing if that returned non-false
            #Do @sourceCollection stuff
            this.showSourceFeatures()

            this.trigger("table:endload")
            return

        fetchCallback: (strategyModels) ->
            #if not valid, redirect to default view
            if strategyModels.length < 1?
                alert "Invalid projectId specified."
                Backbone.history.navigate("", {trigger: true})

            #all models have the same description from this api call
            # so just grab from the first one
            @viewName(strategyModels[0].get("description"))

            super strategyModels

            return

        showSourceFeatures: () ->
            wktFormat = new OpenLayers.Format.WKT()

            bounds = null
            sourceFeatures = []
            wugFeature = @wugLayer.features[0]

            for source in @sourceCollection.models

                #skip sources with no geog
                if not source.get('wktGeog')? then continue

                newFeature = wktFormat.read(source.get('wktGeog'))
                continue if not newFeature? or not newFeature.geometry?

                newFeature.attributes = _.clone(source.attributes)

                #we don't need to carry around the large wktGeog
                delete newFeature.attributes.wktGeog
                
                #transform from geographic to web merc
                @mapView.transformToWebMerc(newFeature.geometry)
        
                if not bounds?
                    bounds = newFeature.geometry.getBounds().clone()
                else
                    bounds.extend(newFeature.geometry.getBounds())

                sourceFeatures.push(newFeature)

            #sort the sourceFeatures so surface water are on top 
            # of everything else
            sourceFeatures.sort((a, b) ->
                
                if a.attributes.sourceType == "SURFACE WATER" then return 1
                if b.attributes.sourceType == "SURFACE WATER" then return -1

                return a.attributes.sourceTypeId - b.attributes.sourceTypeId
            )
            
            #create and add the sourceLayer
            @sourceLayer = new OpenLayers.Layer.Vector(
                "Source Feature Layer",
                {
                    displayInLayerSwitcher: false
                    styleMap: this._sourceStyleMap
                }
            )
            @sourceLayer.addFeatures(sourceFeatures)
            @mapView.map.addLayer(@sourceLayer)
        
            @mapView.map.setLayerIndex(@wugLayer, 
                +@mapView.map.getLayerIndex(@sourceLayer)+1)

            
            this._registerHighlightEvents()
            this._addLayerToControl(@clickFeatureControl, @sourceLayer)
            #this._registerClickEvents() 

            #And zoom the map to include the bounds of the sources as well
            # as the wugFeatures
            if bounds? and @wugLayer? and @wugLayer.features.length > 0
                for wugFeature in @wugLayer.features
                    bounds.extend(wugFeature.geometry.getBounds())
                

            @mapView.zoomToExtent(bounds) if bounds? 

            return

        #override the super's _clickFeature so we can also click
        # source features
        _clickFeature: (feature) ->
            super feature

            if not feature.layer? or feature.layer.id != @sourceLayer.id then return

            #don't do anything for connectors either
            if feature.attributes.featureType? and 
                feature.attributes.featureType == "connector"
                    return

            sourceId = feature.attributes.sourceId
            Backbone.history.navigate("#/#{namespace.currYear}/wms/source/#{sourceId}", 
                {trigger: true})
            return

        _registerHighlightEvents: () ->

            #first add the layer to the control
            this._addLayerToControl(@highlightFeatureControl, @sourceLayer)

            @highlightFeatureControl.events.register('beforefeaturehighlighted', null, (event) =>
                
                feature = event.feature

                #not for connectors
                if feature.attributes.featureType? and 
                    feature.attributes.featureType == "connector"
                        return false #stops the rest of the highlight events

                return true
            )

            @highlightFeatureControl.events.register('featurehighlighted', null, (event) =>
                 
                #only do this handler for @sourceLayer
                if not event.feature.layer? or event.feature.layer.id != @sourceLayer.id
                    return false #stops the rest of the highlight events

                sourceFeature = event.feature

                sourceDisplayName = this._formatDisplayName(
                    sourceFeature.attributes.name)

                popup = new OpenLayers.Popup.FramedCloud("sourcepopup",
                    @mapView.getMouseLonLat(),
                    null, #contentSize
                    "<strong>#{sourceDisplayName}</strong>",
                    null, #anchor
                    true, #closeBox
                    #closeBoxCallback
                ) 

                popup.autoSize = true
                sourceFeature.popup = popup
                @mapView.map.addPopup(popup)
                return
            )

            @highlightFeatureControl.events.register('featureunhighlighted', null, (event) =>
                #only do this handler for @sourceLayer
                if not event.feature.layer? or event.feature.layer.id != @sourceLayer.id
                    return false #stops the rest of the highlight events

                sourceFeature = event.feature
                
                if sourceFeature.popup?
                    @mapView.map.removePopup(sourceFeature.popup)
                    sourceFeature.popup.destroy()
                    sourceFeature.popup = null
                return
            )

            return

            
)