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


BASE_PATH = base_path || "/"
BASE_CONTENT_PATH = base_content_path || "/"
BING_MAPS_KEY = bing_maps_key || ""
        
require([
    'namespace'
    'WMSRouter'
    ],
    (namespace, WMSRouter) ->
        

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
                $('#errorMessage').show() #TODO: is there a more 'centralized' way to handle this?
                $('.contentContainer').hide()
                return
            ).always(() ->
                $('.tableLoading').hide()
                return
            )
)