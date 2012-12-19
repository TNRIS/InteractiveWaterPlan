define([
    'scripts/text!templates/mapTools.html'
],
(tpl) ->

    class MapToolsView extends Backbone.View

        template: _.template(tpl)
        mapView: null #must specify in options argument to constructor

        initialize: (options) ->
            _.bindAll(this, 'render', 'unrender', 'zoomToTexas')

            @mapView = options.mapView

            return

        render: () ->
            #TODO: Need to fill-in place autocomplete
            @$el.html(@template())

            ko.applyBindings(this, @el)

            return this

        unrender: () ->
            @$el.remove()
            return null

        zoomToTexas: () ->
            @mapView.resetExtent()
            return
)