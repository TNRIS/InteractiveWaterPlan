
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


BASE_API_PATH = "/"

#Launch-point for the application
$(()->
    BASE_API_PATH = $("#base_path").val()

    #Config for RequireJS
    require.config(
        baseUrl: "#{BASE_API_PATH}Scripts/Compiled/backbone_app"
        paths:
            "scripts" : "../.." #Used for loading text.js
            "templates": "../../templates" #Used for html templates
    )

    require(['WMSRouter'],
        (WMSRouter) =>
            
            #Extend Backbone.History to trigger an event when a route is not found
            MyHistory = Backbone.History.extend(
                loadUrl: () ->
                    match = Backbone.History.prototype.loadUrl.apply(this, arguments);
                    if !match 
                        this.trigger('route-not-found')
                    return match;
            )
            Backbone.history = new MyHistory()

            #TODO: do prefetching here; use $.when to create the WMSRouter once
            # everything is finished

            

            r = new WMSRouter()
            
            #Catch any bad route and just redirect to default
            Backbone.history.on("route-not-found", () ->
                Backbone.history.navigate("", {trigger: true})
                return
            )

            Backbone.history.start()


            return
    )

    return
)