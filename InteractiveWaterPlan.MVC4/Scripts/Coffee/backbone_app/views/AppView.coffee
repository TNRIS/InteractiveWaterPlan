define([
    'views/MapView'
    'views/ThemeNavView'
    'views/YearNavView'
    'views/BreadcrumbView'
    'views/CountyNetSupplyCollectionView'
    'views/StrategyCollectionView'
    'scripts/text!templates/appContainer.html'
],
(MapView, ThemeNavView, YearNavView, BreadcrumbView, 
    CountyNetSupplyCollectionView, StrategyCollectionView, tpl) ->

    class AppView extends Backbone.View

        #this is the main view-controller of the application
        # and will coordinate events (such as year switching)

        #TODO setup observables for year and theme selection
        # then other views can subscribe to changes

        initialize: () ->
            _.bindAll(this, 'render', 'unrender')

            @template = _.template(tpl)

            return

        render: () ->
            @$el.html(this.template())

            @mapView = new MapView('mapContainer')
            @mapView.render()

            @themeNavView = new ThemeNavView({ el: $('#themeNavContainer')[0] })
            @themeNavView.render()

            @yearNavView = new YearNavView({ el: $('#yearNavContainer')[0] })
            @yearNavView.render()

            @breadcrumbList = new BreadcrumbView({ el: $('#breadcrumbContainer')[0] })
            @breadcrumbList.render()

            @currTableView = new CountyNetSupplyCollectionView({ el: $('#tableContainer')[0] })
            @currTableView.render()

            return this

        unrender: () ->
            @el.remove()
            return null


)