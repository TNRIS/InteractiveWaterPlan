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

            #TODO: this is a little too simplistic...
            # would like to render a span or something that has
            # data for the categoryName and placeId
            this.$('#goToPlaceInput').typeahead(
                minLength: 2
                source: (query, process) ->
                    return $.get("#{BASE_API_PATH}api/place", 
                        {name: query},
                        (data) ->
                            #catNamesArr = _.pluck(data, 'name')
                            #return process(catNamesArr)
                            
                            return process(data)
                    )
                process: (data) ->
                    console.log "in process", data
                    return ['james']


            )

            return this



        unrender: () ->
            @$el.remove()
            return null

        zoomToTexas: () ->
            @mapView.resetExtent()
            return
)