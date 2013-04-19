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
    'views/SourceStrategyCollectionView'
    'views/WmsAreaSelectView'
    'views/MapTopButtonsView'
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
    SourceStrategyCollectionView,
    WmsAreaSelectView,
    MapTopButtonsView) ->

    class WMSRouter extends Backbone.Router
        
        initialize: (options) ->
            _.bindAll(this, 'updateViewsToNewYear', 'updateSelectedWug',
                'onTableStartLoad', 'onTableEndLoad', 'onTableNothingFound', 
                'onTableFetchError', 'highlightWugsByStrategyType')

            @currStrategyView = null
            
            #save reference to the tableContainer dom element
            @tableContainer = $('#tableContainer')[0]

            @mapView = new MapView(
                mapContainerId: 'mapContainer'
                bingApiKey: $('#bing_maps_key').val()
            )
            #save it into the namespace b/c we will use it a lot
            namespace.mapView = @mapView 
            @mapView.render()

            # @mapBottomToolbarView = new MapBottomToolbarView(
            #     el: $('#mapBottomToolsContainer')[0]
            # )
            # @mapBottomToolbarView.render()

            @themeNavToolbarView = new ThemeNavToolbarView(
                el: $('#themeNavContainer')[0]
            )
            #render in 'after' filter

            @mapTopButtonsView = new MapTopButtonsView(
                el: $('#mapTopButtonsContainer')[0]
            )
            @mapTopButtonsView.render()

            @yearNavView = new YearNavView(
                el: $('#yearNavContainer')[0] 
            ) 
            @yearNavView.on("changeyear", this.updateViewsToNewYear) 
            #render in 'after' filter
            
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
            ":year/wms/source/:sourceId":         "wmsSource"
            
            
        # Event Handlers
        onTableStartLoad: () ->
            @areaSelectView.disableSelects()
            @yearNavView.disableYearButtons()
            @themeNavToolbarView.disableStrategyTypeList()
            @mapView.showMapLoading()
            @currStrategyView.showLoading()
            return

        onTableEndLoad: () ->
            @areaSelectView.enableSelects()
            @yearNavView.enableYearButtons()
            @themeNavToolbarView.enableStrategyTypeList()
            @mapView.hideMapLoading()
            @currStrategyView.hideLoading()
            return

        onTableFetchError: () ->
            $('#errorMessage').show() #TODO: is there are more centralized way to do this?
            #alert "An error has occured.  Please reload this page or go back."
            return

        onTableNothingFound: () ->
            this.onTableEndLoad()
            @currStrategyView.showNothingFound()
            return

        updateSelectedWug: (wugId) ->
            if not wugId? #if null, unselect all 
                @currStrategyView.unselectWugFeatures()
            else #select the feature with the given id
                @currStrategyView.selectWugFeature(wugId)
            return

        highlightWugsByStrategyType: (stratTypeId) ->
            if not stratTypeId?
                @currStrategyView.unhighlightStratTypeWugs()
            else
                @currStrategyView.highlightStratTypeWugs(stratTypeId)
                
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
            '': () ->
                $('#errorMessage').hide() #hide in case it was shown
                return

            '^[0-9]{4}/wms': (year) ->
                #unrender the currStrategyView first
                if @currStrategyView?
                    @currStrategyView = @currStrategyView.unrender()

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
                if year? and @currStrategyView?
                    
                    @themeNavToolbarView.render()
                    @yearNavView.render()

                    #subscribe to table events on the new @currStrategyView
                    @currStrategyView.off()
                    @currStrategyView.on("table:startload", this.onTableStartLoad)
                    @currStrategyView.on("table:endload", this.onTableEndLoad)
                    @currStrategyView.on("table:nothingfound", this.onTableNothingFound)
                    @currStrategyView.on("table:fetcherror", this.onTableFetchError)
                    @currStrategyView.on("table:hoverwug", this.updateSelectedWug)
                    @currStrategyView.on("table:hovertype", this.highlightWugsByStrategyType)

                    #then render the table
                    @currStrategyView.render()
                    
                    return

        default: () ->
            #for now, redirect to the wms net-county view
            Backbone.history.navigate("#/#{namespace.currYear}/wms", 
                {trigger: true})
            return

        wmsNetCountySupplies: (year) ->

            if @currStrategyView? then @currStrategyView = @currStrategyView.unrender()

            @currStrategyView = new CountyNetSupplyCollectionView(
                el: @tableContainer
            )

            @mapView.resetExtent()
            
            #TODO: could put this hide/showOverlays stuff in the CollectionView
            @mapView.showWmsOverlayByViewType("Regions")
            @areaSelectView.resetSelects()
            
            return

        wmsRegion: (year, regionLetter) ->

            region = namespace.regionNames.get(regionLetter)
            if not region?
                alert("Invalid region specified.")
                Backbone.history.navigate("", {trigger: true})
                return

            @currStrategyView = new RegionStrategyCollectionView(
                el: @tableContainer
                id: regionLetter
            )

            
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

            @currStrategyView = new CountyStrategyCollectionView(
                el: @tableContainer
                id: countyId
                name: countyName
            )

            
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
            @currStrategyView = new LegeDistrictCollectionView(
                el: @tableContainer
                id: districtId
                type: "house"
                name: district.get("name")
            )

            
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
            @currStrategyView = new LegeDistrictCollectionView(
                el: @tableContainer
                id: districtId
                type: "senate"
                name: district.get("name")
            )

            
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
            @currStrategyView = new StrategyTypeCollectionView(
                el: @tableContainer
                id: typeId
                name: typeName
            )
            
            @areaSelectView.resetSelects()

            return

        wmsEntity: (year, entityId) ->
            #(validation of projectId is taken care of in fetchCallback)
            
            #render the view
            @currStrategyView = new EntityStrategyCollectionView(
                el: @tableContainer
                id: entityId
            )

            @areaSelectView.resetSelects()
            
            @mapView.showWmsOverlayByViewType("CountyNames")

            return

        wmsProjectDetail: (year, projectId) ->
            #(validation of projectId is taken care of in fetchCallback)

            #render the view
            @currStrategyView = new StrategyDetailCollectionView(
                el: @tableContainer
                id: projectId
            )

            @areaSelectView.resetSelects()

            return

        wmsSource: (year, sourceId) ->
            #(validation of sourceId is taken care of in fetchCallback)

            #render the view
            @currStrategyView = new SourceStrategyCollectionView(
                el: @tableContainer
                id: sourceId
            )

            @areaSelectView.resetSelects()

            @mapView.showWmsOverlayByViewType("CountyNames")

            return

)