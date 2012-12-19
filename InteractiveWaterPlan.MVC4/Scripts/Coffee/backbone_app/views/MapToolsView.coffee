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

            #TODO: clear the value if it is not a valid placename
            #TODO: only enable GO button if valid
            this.$('#goToPlaceInput').place_typeahead(
                minLength: 2
                source: (query, process) =>
                    #this.$('#goToPlaceInput').next('button').attr("disabled", "true")
                    return $.get("#{BASE_API_PATH}api/place", 
                        {name: query},
                        (places) ->
                            #catNamesArr = _.pluck(data, 'name')
                            #return process(catNamesArr)
                            return process(places)
                    )
                updater: (item) =>
                    #TODO: Zoom to selected place
                    #placeId = item.id
                    #placeName = item.name
                    console.log "TODO: Zoom to ", item
                    #this.$('#goToPlaceInput').next('button').removeAttr("disabled")
                    return item.name
            )

            return this



        unrender: () ->
            @$el.remove()
            return null

        zoomToTexas: () ->
            @mapView.resetExtent()
            return
)