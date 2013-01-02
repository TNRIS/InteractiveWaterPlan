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
    'scripts/text!templates/appContainer.html'
],
(MapView, ThemeNavView, YearNavView, MapToolsView, BreadcrumbView, 
    CountyNetSupplyCollectionView, 
    RegionStrategyCollectionView, CountyStrategyCollectionView,
    TypeStrategyCollectionView,
    tpl) ->

    class AppView extends Backbone.View

        #this is the main view-controller of the application
        # and will coordinate events (such as year switching)

        #TODO setup observables for year and theme selection
        # then other views can subscribe to changes
        currYear: "2010"

        initialize: (options) ->
            _.bindAll(this, 'render', 'unrender', 'updateViewsToNewYear', 
                'switchStrategyThemeView', '_setupCountyNetSuppliesView', 
                '_setupStrategyTypeView', '_setupCountyStrategyView', 
                '_setupRegionStrategyView')

            @template = _.template(tpl)
            return

        render: () ->
            @$el.html(this.template())

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
            @themeNavView.selectedType.subscribe((options) =>
                options.id = options.id || null
                options.name = options.name || null
 
                if options.type == 'net-supplies' then options.name = "County Net Supplies"

                this.switchStrategyThemeView(options.name, options.type, options.id, true)
            )

            @yearNavView = new YearNavView(
                startingYear: @currYear
                el: $('#yearNavContainer')[0] 
            ) 

            @yearNavView.render()

            #Subscribe to the currentYear observable
            @yearNavView.currentYear.subscribe(this.updateViewsToNewYear)

            @breadcrumbList = new BreadcrumbView({ el: $('#breadcrumbContainer')[0] })
            @breadcrumbList.render()
            @breadcrumbList.selectedBreadcrumb.subscribe((options) =>
                options.id = options.id || null
                this.switchStrategyThemeView(options.name, options.type, options.id)
            )

            #Start the currTableView with the CountyNetSupply table
            this.switchStrategyThemeView("County Net Supplies", 'net-supplies')

            return this

        unrender: () ->
            @el.remove()
            return null

        updateViewsToNewYear: (newYear) ->
            @currYear = newYear
            @currTableView.changeToYear(newYear)
            return

        switchStrategyThemeView: (name, type, id=null, resetBreadcrumbs=false) ->
            #type can be 'net-supplies', 'county', 'region', 'district'
            #TODO: will have to do some map stuff as well

            #unrender the currTableView first
            if @currTableView? then @currTableView = @currTableView.unrender()

            if resetBreadcrumbs then @breadcrumbList.render()

            #Add a new item to the breadcrumb list
            @breadcrumbList.push(name, type, id)

            switch type
                when 'net-supplies' then this._setupCountyNetSuppliesView()
                    
                when 'county' then this._setupCountyStrategyView(name, id)
                    
                when 'region' then this._setupRegionStrategyView(name, id)
                    
                when 'type' then this._setupStrategyTypeView(name, id)
                    
                when 'district'
                    #TODO
                    return
            
            return

        _setupCountyNetSuppliesView: () ->
            @currTableView = new CountyNetSupplyCollectionView(
                currYear: @currYear
                el: @tableContainer
            )
            
            @currTableView.render()

            #Subscripe to selectedCounty and selectedRegion observables
            @currTableView.selectedCounty.subscribe((options) =>
                this.switchStrategyThemeView(options.name, 'county', options.id)
            )

            @currTableView.selectedRegion.subscribe((options) =>
                this.switchStrategyThemeView(options.name, 'region', options.id)
            )

            return

        _setupCountyStrategyView: (name, id) ->
            @currTableView = new CountyStrategyCollectionView(
                el: @tableContainer

                currYear: @currYear
                id: id
                name: name
            )

            @currTableView.render()

            @currTableView.selectedType.subscribe((options) =>
                this.switchStrategyThemeView(options.name, 'type', options.id)
            )

            return


        _setupRegionStrategyView: (name, id) ->
            @currTableView = new RegionStrategyCollectionView(
                el: @tableContainer

                currYear: @currYear
                id: id
                name: name
            )

            @currTableView.render()

            @currTableView.selectedType.subscribe((options) =>
                this.switchStrategyThemeView(options.name, 'type', options.id)
            )

            return

        _setupStrategyTypeView: (name, id) ->
            @currTableView = new TypeStrategyCollectionView(
                el: @tableContainer

                currYear: @currYear
                id: id
                name: name
            )

            @currTableView.render()

            @currTableView.selectedRegion.subscribe((options) =>
                this.switchStrategyThemeView(options.name, 'region', options.id)
            )

            return

)
