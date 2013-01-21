define([
    'namespace'
    'views/MapView'
    'views/ThemeNavToolbarView'
    'views/YearNavView'
    'views/MapBottomToolbarView'
    'views/CountyNetSupplyCollectionView'
    'views/RegionStrategyCollectionView'
    'views/CountyStrategyCollectionView'
    'views/LegeDistrictCollectionView'
    'views/StrategyTypeCollectionView'
    'views/EntityStrategyCollectionView'
    'views/StrategyDetailCollectionView'
    'views/WmsAreaSelectView'
    'views/MapTopButtonsView'
    'collections/StrategyTypeCollection'
    'collections/CountyCollection'
    'collections/RegionCollection'
    'collections/HouseCollection'
    'collections/SenateCollection'
],
(   namespace, 
    MapView, 
    ThemeNavToolbarView, 
    YearNavView, 
    MapBottomToolbarView,
    CountyNetSupplyCollectionView, 
    RegionStrategyCollectionView, 
    CountyStrategyCollectionView,
    LegeDistrictCollectionView,
    StrategyTypeCollectionView,
    EntityStrategyCollectionView,
    StrategyDetailCollectionView,
    WmsAreaSelectView,
    MapTopButtonsView,
    StrategyTypeCollection,
    CountyCollection,
    RegionCollection,
    HouseCollection,
    SenateCollection) ->

    class WMSRouter extends Backbone.Router
        
        initialize: (options) ->
            _.bindAll(this, 'updateViewsToNewYear', 'updateSelectedWug',
                'onTableStartLoad', 'onTableEndLoad', 'onTableNothingFound', 
                'onTableFetchError', 'highlightWugsByStrategyType')

            @currTableView = null
            
            #save reference to the tableContainer dom element
            @tableContainer = $('#tableContainer')[0]

            @mapView = new MapView(
                mapContainerId: 'mapContainer'
                bingApiKey: $('#bing_maps_key').val()
            )
            @mapView.render()

            @mapBottomToolbarView = new MapBottomToolbarView(
                el: $('#mapBottomToolsContainer')[0]
                mapView: @mapView
            )
            @mapBottomToolbarView.render()

            @themeNavToolbarView = new ThemeNavToolbarView(
                el: $('#themeNavContainer')[0]
            )
            #render in 'after' filter

            @mapTopButtonsView = new MapTopButtonsView(
                el: $('#mapTopButtonsContainer')[0]
                mapView: @mapView
            )
            @mapTopButtonsView.render()

            @yearNavView = new YearNavView(
                el: $('#yearNavContainer')[0] 
            ) 
            @yearNavView.on("changeyear", this.updateViewsToNewYear) 
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

            @areaSelectView = new WmsAreaSelectView(
                el: $('#areaSelectContainer')[0]
            )
            @areaSelectView.render()

            return


        routes:
            "":                                   "default" #default route, for now it is the same as :year/wms
            ":year/wms":                          "wmsNetCountySupplies"
            ":year/wms/region/:regionLetter":     "wmsRegion"
            ":year/wms/county/:countyId":         "wmsCounty"
            ":year/wms/house/:districtId":        "wmsHouseDistrict"
            ":year/wms/senate/:districtId":       "wmsSenateDistrict"
            ":year/wms/type/:typeId":             "wmsType"
            ":year/wms/entity/:entityId":         "wmsEntity"
            ":year/wms/project/:projectId":       "wmsProjectDetail"
            #TODO: wms/source/:sourceId
            
            
        # Event Handlers
        onTableStartLoad: () ->
            @areaSelectView.disableSelects()
            @yearNavView.disableYearButtons()
            @themeNavToolbarView.disableStrategyTypeList()
            @mapView.showMapLoading()
            @currTableView.showLoading()
            return

        onTableEndLoad: () ->
            @areaSelectView.enableSelects()
            @yearNavView.enableYearButtons()
            @themeNavToolbarView.enableStrategyTypeList()
            @mapView.hideMapLoading()
            @currTableView.hideLoading()
            return

        onTableFetchError: () ->
            #just redirect back to original view
            alert("An error has occured.")
            Backbone.history.navigate("", {trigger: true})
            return

        onTableNothingFound: () ->
            this.onTableEndLoad()
            @currTableView.showNothingFound()
            return

        updateSelectedWug: (wugId) ->
            if not wugId? #if null, unselect all 
                @mapView.unselectWugFeatures()
            else #select the feature with the given id
                @mapView.selectWugFeature(wugId)
            return

        highlightWugsByStrategyType: (stratTypeId) ->
            if not stratTypeId?
                @mapView.unhighlightStratTypeWugs()
            else
                @mapView.highlightStratTypeWugs(stratTypeId)
                
            return

        updateViewsToNewYear: (newYear) ->
            currRoute = Backbone.history.fragment
            oldYear = ""

            for y in namespace.VALID_YEARS
                if currRoute.indexOf(y+"/") != -1
                    oldYear = y
                    break

            if oldYear == ""
                Backbone.history.navigate("") #just redirect to default

            newRoute = currRoute.replace(oldYear, newYear)
            Backbone.history.navigate("#/"+newRoute, { trigger: true })
            return

        #before filter from backbone.routefilter
        before:
            '^[0-9]{4}/wms': (year) ->
                #unrender the currTableView first
                if @currTableView?
                    @currTableView = @currTableView.unrender()
                    
                if year?
                    if _.contains(namespace.VALID_YEARS, year)
                        namespace.currYear = year
                    else
                        alert "Invalid decade specified."
                        Backbone.history.navigate("", {trigger: true})
                        return false

                return


        #after route filter from backbone.routefilter
        after:
            '^[0-9]{4}/wms': (year) ->
                if year? and @currTableView?
                    
                    @themeNavToolbarView.render()
                    @yearNavView.render()

                    #subscribe to table events on the new @currTableView
                    @currTableView.off()
                    @currTableView.on("table:startload", this.onTableStartLoad)
                    @currTableView.on("table:endload", this.onTableEndLoad)
                    @currTableView.on("table:nothingfound", this.onTableNothingFound)
                    @currTableView.on("table:fetcherror", this.onTableFetchError)
                    @currTableView.on("table:hoverwug", this.updateSelectedWug)
                    @currTableView.on("table:hovertype", this.highlightWugsByStrategyType)

                    #then render the table
                    @currTableView.render()
                    
                    return

        default: () ->
            #for now, redirect to the wms net-county view
            Backbone.history.navigate("#/#{namespace.currYear}/wms", 
                {trigger: true})
            return

        wmsNetCountySupplies: (year) ->

            if @currTableView? then @currTableView = @currTableView.unrender()

            @currTableView = new CountyNetSupplyCollectionView(
                el: @tableContainer

                #pass the mapView so the regions can be drawn
                mapView: @mapView
            )

            @mapView.resetExtent()
            @mapView.clearWugFeatures()

            @mapView.hideWmsOverlays()
            @mapView.showWmsOverlayByViewType("Regions")
            @areaSelectView.resetSelects()
            
            return

        wmsRegion: (year, regionLetter) ->

            region = namespace.regionNames.get(regionLetter)
            if not region?
                alert("Invalid region specified.")
                Backbone.history.navigate("", {trigger: true})
                return

            @currTableView = new RegionStrategyCollectionView(
                el: @tableContainer
                id: regionLetter

                #Also pass the mapView for drawing the region features
                mapView: @mapView
            )

            @mapView.hideWmsOverlays()
            @mapView.showWmsOverlayByViewType("Regions")

            return
        
        wmsCounty: (year, countyId) ->
            #If invalid countyId, then show error
            county = namespace.countyNames.get(countyId)
            if not county?
                alert("Invalid countyId specified.")
                Backbone.history.navigate("", {trigger: true})
                return

            #otherwise render the view
            countyName = county.get('name')

            @currTableView = new CountyStrategyCollectionView(
                el: @tableContainer
                id: countyId
                name: countyName
            )

            @mapView.hideWmsOverlays()
            @mapView.showWmsOverlayByViewType("Counties")
            
            return

        wmsHouseDistrict: (year, districtId) ->
            #If invalid districtId, then show error
            district = namespace.houseNames.get(districtId)
            if not district?
                alert("Invalid districtId specified.")
                Backbone.history.navigate("", {trigger: true})
                return

            #otherwise render the view
            @currTableView = new LegeDistrictCollectionView(
                el: @tableContainer
                id: districtId
                type: "house"
                name: district.get("name")
            )

            @mapView.hideWmsOverlays()
            @mapView.showWmsOverlayByViewType("HouseDistricts")
            
            return

        wmsSenateDistrict: (year, districtId) ->
            #If invalid districtId, then show error
            district = namespace.senateNames.get(districtId)
            if not district?
                alert("Invalid districtId specified.")
                Backbone.history.navigate("", {trigger: true})
                return


            #otherwise render the view
            @currTableView = new LegeDistrictCollectionView(
                el: @tableContainer
                id: districtId
                type: "senate"
                name: district.get("name")
            )

            @mapView.hideWmsOverlays()
            @mapView.showWmsOverlayByViewType("SenateDistricts")
            
            return

        wmsType: (year, typeId) ->
           
            #If invalid typeId, then show error
            wmsType = namespace.strategyTypes.get(typeId)
            if not wmsType?
                alert("Invalid typeId specified.")
                Backbone.history.navigate("", {trigger: true})
                return

            typeName = wmsType.get('name')

            #otherwise render the view
            @currTableView = new StrategyTypeCollectionView(
                el: @tableContainer
                id: typeId
                name: typeName
            )
            
            @areaSelectView.resetSelects()

            return

        wmsEntity: (year, entityId) ->
            #(validation of projectId is taken care of in fetchCallback)
            
            #render the view
            @currTableView = new EntityStrategyCollectionView(
                el: @tableContainer
                id: entityId
            )

            @areaSelectView.resetSelects()

            return

        wmsProjectDetail: (year, projectId) ->
            #(validation of projectId is taken care of in fetchCallback)

            #render the view
            @currTableView = new StrategyDetailCollectionView(
                el: @tableContainer
                id: projectId
            )

            @areaSelectView.resetSelects()

            return

)