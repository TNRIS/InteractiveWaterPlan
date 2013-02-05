
#Note: jquery, underscore.js, and backbone.js are loaded on the page and registered globally
# so we do not need to load them via RequireJS define statements

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


BASE_PATH = "/"
BASE_CONTENT_PATH = "/"

#Launch-point for the application
$(()->
    BASE_PATH = $("#base_path").val()
    BASE_CONTENT_PATH = $("#base_content_path").val()

    #Config for RequireJS
    require.config(
        baseUrl: "#{BASE_PATH}Scripts/Compiled/backbone_app"
        paths:
            "scripts" : "../.." #Used for loading text.js
            "templates": "../../templates" #Used for html templates
    )

    require([
        'namespace'
        'WMSRouter'
        ],
        (namespace, WMSRouter) =>
            
            #Extend Backbone.History to trigger an event when a route is not found
            MyHistory = Backbone.History.extend(
                loadUrl: () ->
                    match = Backbone.History.prototype.loadUrl.apply(this, arguments);
                    if !match 
                        this.trigger('route-not-found')
                    return match;
            )
            Backbone.history = new MyHistory()

            #Catch any bad routes and just redirect to default
            Backbone.history.on("route-not-found", () ->
                Backbone.history.navigate("", {trigger: true})
                return
            )

            $('.tableLoading').show()

            #Bootstrap data into namespace
            namespace.bootstrapData()
                .done(
                    () ->
                        r = new WMSRouter()
                        Backbone.history.start()
                        return
                ).fail(() ->
                    alert "An error has occured.  Please reload this page or go back."
                    $('#errorMessage').show() #TODO: is there a more 'centralized' way to handle this?
                    return
                ).always(() ->
                    $('.tableLoading').hide()
                    return
                )

            return
    )

    return
)