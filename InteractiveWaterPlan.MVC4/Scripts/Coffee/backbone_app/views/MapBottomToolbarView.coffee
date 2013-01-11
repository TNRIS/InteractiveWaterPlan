define([
    'models/PlaceFeatureModel'
    'scripts/text!templates/mapBottomRightTools.html'
],
(PlaceFeature, tpl) ->

    class MapBottomToolbarView extends Backbone.View

        template: _.template(tpl)
        mapView: null #must specify in options argument to constructor

        initialize: (options) ->
            _.bindAll(this, 'render', 'unrender', 'showPlaceFeature')

            @mapView = options.mapView

            return

        render: () ->
            @$el.html(@template())

            ko.applyBindings(this, @el)

            this.$('#goToPlaceInput').place_typeahead(
                minLength: 2

                source: (query, process) ->
                    this.$element.data('selected-place-id', null)

                    return $.get("#{BASE_API_PATH}api/place", 
                        {name: query},
                        (places) ->
                            return process(places)
                    )

                buttonClick: this.showPlaceFeature
            )

            return this

        unrender: () ->
            @$el.remove()
            return null

        showPlaceFeature: () ->
            selectedPlaceId = this.$('#goToPlaceInput').data('selected-place-id')

            placeFeature = new PlaceFeature()
            placeFeature.fetch(
                    data:
                        placeId: selectedPlaceId
                    success: (model) =>
                        @mapView.showPlaceFeature(model)
                )
            
            return

        
)