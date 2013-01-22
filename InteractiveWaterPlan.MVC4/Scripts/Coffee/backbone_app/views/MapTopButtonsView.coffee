define([
    'scripts/text!templates/mapTopButtons.html'
],
(tpl) ->
    
    class MapTopButtonsView extends Backbone.View

        template: _.template(tpl)
        
        initialize: (options) ->
            _.bindAll(this, 'render', 'unrender', 'toggleMapViewLock', 
                'zoomToTexas', 'toggleMap')

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

        toggleMapViewLock: (data, event) ->
            $target = $(event.delegateTarget)
            $icon = $('i', $target)

            #swap the icon class
            swap = $icon.attr('class')
            $icon.attr('class', $target.attr('data-other-icon-class'))
            $target.attr('data-other-icon-class', swap)

            if $target.hasClass("locked") #then unlock the map
                $target.removeClass("locked")
                @mapView.isMapLocked = false
            else #then lock the map
                $target.addClass("locked")
                @mapView.isMapLocked = true
                
            return

        zoomToTexas: () ->
            @mapView.resetExtent()
            return

        toggleMap: (data, event) ->
            $target = $(event.delegateTarget)

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