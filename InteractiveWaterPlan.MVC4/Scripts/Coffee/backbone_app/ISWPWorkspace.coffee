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
],
(MapView, ThemeNavView, YearNavView, MapToolsView, BreadcrumbView, 
    CountyNetSupplyCollectionView, 
    RegionStrategyCollectionView, 
    CountyStrategyCollectionView,
    TypeStrategyCollectionView) ->

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

            return

        routes:
            "":                             "wmsNetCountySupplies" #default route, for now it is the same as wms
            "wms":                          "wmsNetCountySupplies"
            "wms/region/:regionLetter":     "wmsRegion"
            "wms/county/:countyId":         "wmsCounty"
            "wms/type/:typeId":             "wmsType"
            #TODO: wms/entity/:entityId
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
                name: regionLetter #TODO
            )

            @currTableView.render()

            return
        
        wmsCounty: (countyId) ->
            #unrender the currTableView first
            if @currTableView? then @currTableView = @currTableView.unrender()

            @currTableView = new CountyStrategyCollectionView(
                el: @tableContainer

                currYear: @currYear
                id: countyId
                name: countyId #TODO: get county name somehow
            )

            @currTableView.render()

            return

        wmsType: (typeId) ->
            #unrender the currTableView first
            if @currTableView? then @currTableView = @currTableView.unrender()

            @currTableView = new TypeStrategyCollectionView(
                el: @tableContainer

                currYear: @currYear
                id: typeId
                name: typeId #TODO: get the name of the StrategyType
            )

            @currTableView.render()

            return
)