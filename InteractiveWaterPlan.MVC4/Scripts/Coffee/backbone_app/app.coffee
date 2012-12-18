
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


#Launch-point for the application
$(()->
    BASE_API_PATH = $("#base_path").val()

    #TODO: history/routing
    Workspace = new Backbone.Router(
        routes: {}
    )

    define([
        'views/AppView'
    ],
    (AppView) ->
        appView = new AppView({el: $('#appContainer')[0]})
        appView.render()

        #Backbone.history.start(
        #    pushState: true
        #)

        return
    )  
)