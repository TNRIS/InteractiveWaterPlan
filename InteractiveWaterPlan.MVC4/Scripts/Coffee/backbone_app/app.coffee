
#Note: jquery, underscore.js, and backbone.js are loaded on the page and registered globally
# so we do not need to load them via RequireJS define statements

#TODO: Use the RequireJS optimizer before deployment: http://requirejs.org/docs/optimization.html

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

#Config for RequireJS
require.config(
    paths:
        "scripts" : "../.." #Used for loading text.js
        "templates": "../../templates" #Used for html templates

    #TODO: Remove for production
    urlArgs: "bust=" +  (new Date()).getTime() #busts the cache on each RequireJS request.
)

#Launch-point for the application
$(()->
    BASE_API_PATH = $("#base_path").val()

    define(
        'app.js', 
        ['WMSRouter'],
        (WMSRouter) ->
            #Create a router instance and start it up
            wmsRouter = new WMSRouter()
            Backbone.history.start()
            return
        )
    require(['app.js'])

    return

)