define([
    'views/AppView'
]
(AppView) ->
    class ISWPWorkspace extends Backbone.Router
       
        initialize: (options) ->
            #setup the main views here instead of in AppView ?
            #TODO: need to setup the MapView here

            return

        routes:
            "":                             "index" #default route, for now it is the same as wms
            "wms":                          "index"
            "wms/region/:regionLetter":     "wmsRegion"
            "wms/county/:countyId":         "wmsCounty"
            "wms/type/:typeId":             "wmsType"
            #TODO: wms/entity/:entityId
            #TODO: wms/source/:sourceId

        index: () ->
            
            appView = new AppView({el: $('#appContainer')[0]})
            appView.render()

            return

        wmsRegion: (regionLetter) ->
            console.log regionLetter
            return
        
        wmsCounty: (countyId) ->
            console.log countyId
            return

        wmsType: (typeId) ->
            console.log typeId
            return
)