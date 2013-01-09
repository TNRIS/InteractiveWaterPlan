define([
    'namespace'
    'views/MapView'
    'views/ThemeNavView'
    'views/YearNavView'
    'views/MapToolsView'
    'views/CountyNetSupplyCollectionView'
    'views/RegionStrategyCollectionView'
    'views/CountyStrategyCollectionView'
    'views/StrategyTypeCollectionView'
    'views/EntityStrategyCollectionView'
    'views/CountyRegionSelectView'
    'collections/StrategyTypeCollection'
    'collections/CountyCollection'
    'collections/RegionCollection'
],
(   namespace, 
    MapView, 
    ThemeNavView, 
    YearNavView, 
    MapToolsView,
    CountyNetSupplyCollectionView, 
    RegionStrategyCollectionView, 
    CountyStrategyCollectionView,
    StrategyTypeCollectionView,
    EntityStrategyCollectionView,
    CountyRegionSelectView
    StrategyTypeCollection,
    CountyCollection,
    RegionCollection) ->

    class ISWPRouter extends Backbone.Router
        
        
        initialize: (options) ->
            _.bindAll(this, 'updateViewsToNewYear')

            @currTableView = null
            
            #save reference to the tableContainer dom element
            @tableContainer = $('#tableContainer')[0]

            @mapView = new MapView(
                mapContainerId: 'mapContainer'
                bingApiKey: $('#bing_maps_key').val()
            )
            @mapView.render()

            @mapToolsView = new MapToolsView({ 
                el: $('#mapTools')[0]
                mapView: @mapView
            })
            @mapToolsView.render()

            @themeNavView = new ThemeNavView({ el: $('#themeNavContainer')[0] })
            @themeNavView.render()

            @yearNavView = new YearNavView(
                el: $('#yearNavContainer')[0] 
            ) 
            #@yearNavView.render()
            #@yearNavView.currentYear.subscribe(this.updateViewsToNewYear)

            #Load the boostrapped arrays (defined in Index.cshtml)
            namespace.strategyTypes = new StrategyTypeCollection()
            namespace.strategyTypes.reset(initStrategyTypes)

            namespace.countyNames = new CountyCollection()
            namespace.countyNames.reset(initCountyNames)

            namespace.regionNames = new RegionCollection()
            namespace.regionNames.reset(initRegionNames)

            @countyRegionSelect = new CountyRegionSelectView(
                el: $('#regionCountySelectContainer')[0]
                counties: namespace.countyNames
                regions: namespace.regionNames
            )
            @countyRegionSelect.render()

            return

        updateViewsToNewYear: (newYear) ->
            currRoute = Backbone.history.fragment
            oldYear = ""

            for y in namespace.VALID_YEARS
                if currRoute.indexOf(y+"/") != -1
                    oldYear = y
                    break

            if oldYear == ""
                throw "Year invalid." #TODO: show error to user?
                Backbone.history.navigate("") #just redirect to default

            
            newRoute = currRoute.replace(oldYear, newYear)

            Backbone.history.navigate("#/"+newRoute, { trigger: true })
            return

        #TODO: validate year (use namespace.VALID_YEARS)
        # and see http://stackoverflow.com/questions/7394695/backbone-js-call-method-before-after-a-route-is-fired
        # for possible way to wrap each route to check for valid year
        routes:
            "":                                   "default" #default route, for now it is the same as wms
            ":year/wms":                          "wmsNetCountySupplies"
            ":year/wms/region/:regionLetter":     "wmsRegion"
            ":year/wms/county/:countyId":         "wmsCounty"
            ":year/wms/type/:typeId":             "wmsType"
            ":year/wms/entity/:entityId":         "wmsEntity"
            #TODO: wms/source/:sourceId

        default: () ->
            #for now, redirect to the wms net-county view

            Backbone.history.navigate("#/#{namespace.currYear}/wms", {trigger: true})
            return

        wmsNetCountySupplies: (year) ->
            namespace.currYear = year #TODO: Validate year

            #unrender the currTableView first
            if @currTableView? then @currTableView = @currTableView.unrender()

            @currTableView = new CountyNetSupplyCollectionView(
                el: @tableContainer
            )
            
            @currTableView.render()
            #TODO: maybe put this in route:after as in http://stackoverflow.com/questions/7394695/backbone-js-call-method-before-after-a-route-is-fired
            @yearNavView.render().currentYear.subscribe(this.updateViewsToNewYear) 
            @themeNavView.render()

            return

        wmsRegion: (year, regionLetter) ->
            namespace.currYear = year #TODO: Validate year

            #unrender the currTableView first
            if @currTableView? then @currTableView = @currTableView.unrender()

            #TODO: If invalid regionLetter, then show error
            @currTableView = new RegionStrategyCollectionView(
                el: @tableContainer
                id: regionLetter
                name: regionLetter
            )

            @currTableView.render()
            #TODO: maybe put this in route:after as in http://stackoverflow.com/questions/7394695/backbone-js-call-method-before-after-a-route-is-fired
            @yearNavView.render().currentYear.subscribe(this.updateViewsToNewYear) 
            @themeNavView.render()
            return
        
        wmsCounty: (year, countyId) ->
            namespace.currYear = year #TODO: Validate year

            #unrender the currTableView first
            if @currTableView? then @currTableView = @currTableView.unrender()

            #TODO: If invalid countyId, then show error
            countyName = namespace.countyNames.get(countyId).get('name')

            @currTableView = new CountyStrategyCollectionView(
                el: @tableContainer
                id: countyId
                name: countyName
            )

            @currTableView.render()
            #TODO: maybe put this in route:after as in http://stackoverflow.com/questions/7394695/backbone-js-call-method-before-after-a-route-is-fired
            @yearNavView.render().currentYear.subscribe(this.updateViewsToNewYear) 
            @themeNavView.render()
            return

        wmsType: (year, typeId) ->
            namespace.currYear = year #TODO: Validate year

            #unrender the currTableView first
            if @currTableView? then @currTableView = @currTableView.unrender()

            #TODO: If invalid typeId, then show error
            typeName = namespace.strategyTypes.get(typeId).get('name')

            @currTableView = new StrategyTypeCollectionView(
                el: @tableContainer
                id: typeId
                name: typeName
            )

            @currTableView.render()
            #TODO: maybe put this in route:after as in http://stackoverflow.com/questions/7394695/backbone-js-call-method-before-after-a-route-is-fired
            @yearNavView.render().currentYear.subscribe(this.updateViewsToNewYear) 
            @themeNavView.render()
            return

        wmsEntity: (year, entityId) ->
            namespace.currYear = year #TODO: Validate year

            #unrender the currTableView first
            if @currTableView? then @currTableView = @currTableView.unrender()

            #get the entity name from an API call
            EntityModel = Backbone.Model.extend(
                url: "#{BASE_API_PATH}api/entity/#{entityId}" 
            )

            entity = new EntityModel()

            entity.fetch(
                success: (model) =>
                    #TODO: If invalid entityId, then show error
                    
                    @currTableView = new EntityStrategyCollectionView(
                        el: @tableContainer
                        id: entityId
                        name: model.get("name")
                    )

                    @currTableView.render()
                    #TODO: maybe put this in route:after as in http://stackoverflow.com/questions/7394695/backbone-js-call-method-before-after-a-route-is-fired
                    @yearNavView.render().currentYear.subscribe(this.updateViewsToNewYear) 
                    @themeNavView.render()
                    return
            )

            return
)