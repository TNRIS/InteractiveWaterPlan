define([
    'views/MapView'
    'views/ThemeNavView'
    'views/YearNavView'
    'views/BreadcrumbView'
    'views/CountyNetSupplyCollectionView'
    'views/RegionStrategyCollectionView'
    'views/CountyStrategyCollectionView'
    'scripts/text!templates/appContainer.html'
],
(MapView, ThemeNavView, YearNavView, BreadcrumbView, 
    CountyNetSupplyCollectionView, 
    RegionStrategyCollectionView, CountyStrategyCollectionView,
    tpl) ->

    class AppView extends Backbone.View

        #this is the main view-controller of the application
        # and will coordinate events (such as year switching)

        #TODO setup observables for year and theme selection
        # then other views can subscribe to changes
        currYear: "2010"

        initialize: (options) ->
            _.bindAll(this, 'render', 'unrender', 'updateViewsToNewYear', 
                'switchStrategyThemeView')

            @template = _.template(tpl)
            return

        render: () ->
            @$el.html(this.template())

            #save reference to the tableContainer dom element
            @tableContainer = $('#tableContainer')[0]

            @mapView = new MapView('mapContainer')
            @mapView.render()

            @themeNavView = new ThemeNavView({ el: $('#themeNavContainer')[0] })
            @themeNavView.render()

            @yearNavView = new YearNavView(
                startingYear: @currYear
                el: $('#yearNavContainer')[0] 
            )
            @yearNavView.render()

            #Subscribe to the currentYear observable
            @yearNavView.currentYear.subscribe(this.updateViewsToNewYear)

            @breadcrumbList = new BreadcrumbView({ el: $('#breadcrumbContainer')[0] })
            @breadcrumbList.render()
            @breadcrumbList.selectedStrategyView.subscribe((viewName) =>
                this.switchStrategyThemeView(viewName)
            )

            #Start the currTableView with the CountyNetSupply table
            this.switchStrategyThemeView('net-supplies')

            return this

        unrender: () ->
            @el.remove()
            return null

        updateViewsToNewYear: (newYear) ->
            @currYear = newYear
            @currTableView.changeToYear(newYear)
            return

        switchStrategyThemeView: (type, options) ->
            #TODO: will have to do some map stuff as well

            #unrender the currTableView first
            if @currTableView? then @currTableView = @currTableView.unrender()

            switch type
                when 'net-supplies'
                    @currTableView = new CountyNetSupplyCollectionView(
                        currYear: @currYear
                        el: @tableContainer
                    )
                    @currTableView.render()

                    #Subscripe to selectedCounty and selectedRegion observables
                    @currTableView.selectedCounty.subscribe((val) =>
                        this.switchStrategyThemeView("county", {
                            countyId: val.countyId
                            countyName: val.countyName
                        })
                    )

                    @currTableView.selectedRegion.subscribe((val) =>
                        this.switchStrategyThemeView("region", {
                            regionId: val.regionId
                            regionName: val.regionName
                        })
                    )
                when 'county'
                    @currTableView = new CountyStrategyCollectionView(
                        el: @tableContainer

                        currYear: @currYear
                        countyId: options.countyId
                        countyName: options.countyName
                    )

                    @currTableView.render()
                    return
                when 'region'
                    @currTableView = new RegionStrategyCollectionView(
                        el: @tableContainer

                        currYear: @currYear
                        regionId: options.regionId
                        regionName: options.regionName
                    )

                    @currTableView.render()

                    return
                when 'type'
                    #TODO
                    return
            
            return


)