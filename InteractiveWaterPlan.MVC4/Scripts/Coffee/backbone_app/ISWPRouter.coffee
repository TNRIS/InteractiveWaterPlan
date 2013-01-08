define([
    'namespace'
    'views/MapView'
    'views/ThemeNavView'
    'views/YearNavView'
    'views/MapToolsView'
    'views/BreadcrumbView'
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
    BreadcrumbView, 
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
            @currYear = "2010" #TODO: make year a namespace variable

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
                startingYear: @currYear
                el: $('#yearNavContainer')[0] 
            ) 
            @yearNavView.render()
            @yearNavView.currentYear.subscribe(this.updateViewsToNewYear)
            #TODO: year in backbone routes?

            @breadcrumbList = new BreadcrumbView({ el: $('#breadcrumbContainer')[0] })
            @breadcrumbList.render()

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
            @currYear = newYear
            @currTableView.changeToYear(newYear)
            return

        #TODO: include :year at start of routes and update logic accordingly
        routes:
            "":                             "wmsNetCountySupplies" #default route, for now it is the same as wms
            "wms":                          "wmsNetCountySupplies"
            "wms/region/:regionLetter":     "wmsRegion"
            "wms/county/:countyId":         "wmsCounty"
            "wms/type/:typeId":             "wmsType"
            "wms/entity/:entityId":         "wmsEntity"
            #TODO: wms/source/:sourceId

        wmsNetCountySupplies: () ->
            #unrender the currTableView first
            if @currTableView? then @currTableView = @currTableView.unrender()

            @currTableView = new CountyNetSupplyCollectionView(
                el: @tableContainer
                currYear: @currYear
            )
            
            @currTableView.render()

            return

        wmsRegion: (regionLetter) ->
            #unrender the currTableView first
            if @currTableView? then @currTableView = @currTableView.unrender()

            #TODO: If invalid regionLetter, then show error
            @currTableView = new RegionStrategyCollectionView(
                el: @tableContainer

                currYear: @currYear
                id: regionLetter
                name: regionLetter
            )

            @currTableView.render()

            return
        
        wmsCounty: (countyId) ->
            #unrender the currTableView first
            if @currTableView? then @currTableView = @currTableView.unrender()

            #TODO: If invalid countyId, then show error
            countyName = namespace.countyNames.get(countyId).get('name')

            @currTableView = new CountyStrategyCollectionView(
                el: @tableContainer

                currYear: @currYear
                id: countyId
                name: countyName
            )

            @currTableView.render()

            return

        wmsType: (typeId) ->
            #unrender the currTableView first
            if @currTableView? then @currTableView = @currTableView.unrender()

            #TODO: If invalid typeId, then show error
            typeName = namespace.strategyTypes.get(typeId).get('name')

            @currTableView = new StrategyTypeCollectionView(
                el: @tableContainer

                currYear: @currYear
                id: typeId
                name: typeName
            )

            @currTableView.render()

            return

        wmsEntity: (entityId) ->
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
                    console.log model

                    @currTableView = new EntityStrategyCollectionView(
                        el: @tableContainer

                        currYear: @currYear
                        id: entityId
                        name: model.get("name") #TODO: get entity name somehow
                    )

                    @currTableView.render()
                    return
            )

            return
)