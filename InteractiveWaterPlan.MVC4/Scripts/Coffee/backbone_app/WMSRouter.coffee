define([
    'namespace'
    'views/MapView'
    'views/MapTopToolbarView'
    'views/YearNavView'
    'views/MapBottomToolbarView'
    'views/CountyNetSupplyCollectionView'
    'views/RegionStrategyCollectionView'
    'views/CountyStrategyCollectionView'
    'views/StrategyTypeCollectionView'
    'views/EntityStrategyCollectionView'
    'views/WmsAreaSelectView'
    'collections/StrategyTypeCollection'
    'collections/CountyCollection'
    'collections/RegionCollection'
    'collections/HouseCollection'
    'collections/SenateCollection'
],
(   namespace, 
    MapView, 
    MapTopToolbarView, 
    YearNavView, 
    MapBottomToolbarView,
    CountyNetSupplyCollectionView, 
    RegionStrategyCollectionView, 
    CountyStrategyCollectionView,
    StrategyTypeCollectionView,
    EntityStrategyCollectionView,
    WmsAreaSelectView
    StrategyTypeCollection,
    CountyCollection,
    RegionCollection,
    HouseCollection,
    SenateCollection) ->

    class WMSRouter extends Backbone.Router
        
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

            @mapBottomToolbarView = new MapBottomToolbarView(
                el: $('#mapTools')[0]
                mapView: @mapView
            )
            @mapBottomToolbarView.render()

            @mapTopToolbarView = new MapTopToolbarView(
                el: $('#themeNavContainer')[0]
                mapView: @mapView
            )
            #render in 'after' filter

            @yearNavView = new YearNavView(
                el: $('#yearNavContainer')[0] 
            ) 
            #render in 'after' filter
            
            #Load the boostrapped arrays (defined in Index.cshtml)
            namespace.strategyTypes = new StrategyTypeCollection()
            namespace.strategyTypes.reset(initStrategyTypes)

            namespace.countyNames = new CountyCollection()
            namespace.countyNames.reset(initCountyNames)

            namespace.regionNames = new RegionCollection()
            namespace.regionNames.reset(initRegionNames)

            namespace.houseNames = new HouseCollection()
            namespace.houseNames.reset(initHouseNames)

            namespace.senateNames = new SenateCollection()
            namespace.senateNames.reset(initSenateNames)

            @countyRegionSelect = new WmsAreaSelectView(
                el: $('#regionCountySelectContainer')[0]
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

        #before filter from backbone.routefilter
        before:
            '': (year) ->
                #unrender the currTableView first
                if @currTableView?
                    @currTableView = @currTableView.unrender()
                
                if year?
                    if _.contains(namespace.VALID_YEARS, year)
                        namespace.currYear = year
                    else
                        throw "Invalid Year."
                        return false
                return

        after:
            '': (year) ->
                if year?
                    @currTableView.render()
                    @yearNavView.render().currentYear.subscribe(
                        this.updateViewsToNewYear) 
                    @mapTopToolbarView.render()
       

        default: () ->
            #for now, redirect to the wms net-county view
            Backbone.history.navigate("#/#{namespace.currYear}/wms", 
                {trigger: true})
            return

        wmsNetCountySupplies: (year) ->

            if @currTableView? then @currTableView = @currTableView.unrender()

            @currTableView = new CountyNetSupplyCollectionView(
                el: @tableContainer
            )
            
            return

        wmsRegion: (year, regionLetter) ->
          
            #TODO: If invalid regionLetter, then show error
            @currTableView = new RegionStrategyCollectionView(
                el: @tableContainer
                id: regionLetter
                name: regionLetter
            )

            return
        
        wmsCounty: (year, countyId) ->
          
            #TODO: If invalid countyId, then show error
            countyName = namespace.countyNames.get(countyId).get('name')

            @currTableView = new CountyStrategyCollectionView(
                el: @tableContainer
                id: countyId
                name: countyName
            )
            
            return

        wmsType: (year, typeId) ->
           
            #TODO: If invalid typeId, then show error
            typeName = namespace.strategyTypes.get(typeId).get('name')

            @currTableView = new StrategyTypeCollectionView(
                el: @tableContainer
                id: typeId
                name: typeName
            )
            
            return

        wmsEntity: (year, entityId) ->
            
            #TODO: If invalid entityId, then show error
                    
            @currTableView = new EntityStrategyCollectionView(
                el: @tableContainer
                id: entityId
            )

            return

)