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

        toggleAreaSelects: (data, event) ->
            $target = $(event.delegateTarget)
            
            toggleSelector = $target.data('toggle')

            $(toggleSelector).slideToggle(300, () ->
                $i = $('i', $target)
                if $i.hasClass('icon-caret-up') #it is shown, so hide it
                    $i.removeClass('icon-caret-up')
                    $i.addClass('icon-caret-down')
                else
                    $i.addClass('icon-caret-up') #it is hidden, so show it
                    $i.removeClass('icon-caret-down')

                #and swap the title span with the data-title-orig
                oldTitle = $('.title', $target).html()
                $('.title', $target).html($target.attr('data-title-orig'))
                $target.attr('data-title-orig', oldTitle)
            )
           
            return

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