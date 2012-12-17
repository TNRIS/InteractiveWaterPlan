
#Note: jquery, underscore.js, and backbone.js are loaded on the page and registered globally
# so we do not need to load them via requirejs define statements

#TODO: Use the requirejs optimizer before deployment: http://requirejs.org/docs/optimization.html

#This is to prevent errors in IE when a console statement
# is in the remaining code
console = console || {}
console.log = console.log || () ->
                                return null

#Setup underscore to use mustache style template tags {{ like.this }}
_.extend(
    _.templateSettings,
    {
        interpolate : /\{\{(.+?)\}\}/g
    })


BASE_API_PATH = "/"

#Config
require.config(
    paths:
        "scripts" : "../.." #Used for loading text.js
        "templates": "../../templates" #Used for html templates

    #TODO: Remove for prod
    urlArgs: "bust=" +  (new Date()).getTime() #busts the cache on each requirejs request.
)


$(()->
    BASE_API_PATH = $("#base_path").val()

    define([
        'views/MapView'
        'views/ThemeNavViewModel'
        'views/YearNavViewModel'
        'views/BreadcrumbViewModel'
        'views/StrategyCollectionView'
        #'scripts/text!templates/mainView.html'
    ],
    (MapView, ThemeNavViewModel, YearNavViewModel, BreadcrumbViewModel, StrategyCollectionView) ->

        @mapView = new MapView('mapContainer')
        @mapView.render()

        themeNavView = new ThemeNavViewModel()
        $('#themeNavContainer').html(themeNavView.render().el)

        yearNavView = new YearNavViewModel()
        $('#yearNavContainer').html(yearNavView.render().el)

        breadcrumbList = new BreadcrumbViewModel()
        $('#breadcrumbContainer').html(breadcrumbList.render().el)

        strategyTable = new StrategyCollectionView()
        $('#tableContainer').html(strategyTable.render().el)


        return null
    )  
)