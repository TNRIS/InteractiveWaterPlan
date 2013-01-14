define([
    'scripts/text!templates/mapTopButtons.html'
],
(tpl) ->
    
    class MapTopButtonsView extends Backbone.View

        template: _.template(tpl)
        
        initialize: (options) ->
            _.bindAll(this, 'render', 'unrender', 'zoomToTexas', 'toggleMap')

            if not options.mapView? 
                throw "options.mapView not defined"

            @mapView = options.mapView

            return null

        render: () ->
            @$el.empty()
            @$el.html(@template())
            ko.applyBindings(this, @el) #need for the hide/show map button

            return this

        unrender: () ->
            @$el.remove()
            return null

        zoomToTexas: () ->
            @mapView.resetExtent()
            return

        toggleMap: (data, event, $el) ->
            if $el?
                $target = $el
            else
                $target = $(event.target)

            if $target.hasClass('off')
                $target.html('Hide Map')
                $('#mapContainer').slideDown()
                $('.map-stuff').show()
                $target.removeClass('off')

            else
                $target.addClass('off')
                $('#mapContainer').slideUp()
                $('.map-stuff').hide()
                $target.html('Show Map')

            return
)