define([
    'views/MapView'
    'views/ThemeNavView'
    'views/YearNavView'
    'views/MapToolsView'
    'views/BreadcrumbView'
    'views/CountyNetSupplyCollectionView'
    'views/RegionStrategyCollectionView'
    'views/CountyStrategyCollectionView'
    'views/TypeStrategyCollectionView'
    'views/EntityStrategyCollectionView'
    'collections/StrategyTypeCollection'
    'collections/CountyCollection'
],
(MapView, ThemeNavView, YearNavView, MapToolsView, BreadcrumbView, 
    CountyNetSupplyCollectionView, 
    RegionStrategyCollectionView, 
    CountyStrategyCollectionView,
    TypeStrategyCollectionView,
    EntityStrategyCollectionView,
    StrategyTypeCollection,
    CountyCollection) ->

    class ISWPWorkspace extends Backbone.Router
       
        initialize: (options) ->
            
            @currTableView = null
            @currYear = "2010"

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

            @breadcrumbList = new BreadcrumbView({ el: $('#breadcrumbContainer')[0] })
            @breadcrumbList.render()

            #Load the boostrapped arrays (defined in Index.cshtml)
            @strategyTypes = new StrategyTypeCollection()
            @strategyTypes.reset(initStrategyTypes)

            @countyNames = new CountyCollection()
            @countyNames.reset(initCountyNames)


            return

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

            countyName = @countyNames.get(countyId).get('name')

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

            typeName = @strategyTypes.get(typeId).get('name')

            @currTableView = new TypeStrategyCollectionView(
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


            #TODO: get the entity name from an API call
            # and put this in success callback

            @currTableView = new EntityStrategyCollectionView(
                el: @tableContainer

                currYear: @currYear
                id: entityId
                name: entityId #TODO: get entity name somehow
            )

            @currTableView.render()


            return
)