define([
    'WMSRouter'
],
(WMSRouter) ->

    initialize = () ->
        wmsRouter = new WMSRouter()
        Backbone.history.start()
        return

    return {
        initialize: initialize
    }

)