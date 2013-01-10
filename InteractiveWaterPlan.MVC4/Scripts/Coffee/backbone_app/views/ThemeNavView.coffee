define([
    'namespace'
    'collections/StrategyTypeCollection'
    'scripts/text!templates/strategyTypeListItem.html'
    'scripts/text!templates/themeNav.html'
],
(namespace, StrategyTypeCollection, strategyTypeListItemTpl, tpl) ->
    
    #TODO: The dropdown no longer changes on selection - do we care?
    class ThemeNavView extends Backbone.View

        template: _.template(tpl)
        mapView: null #must specify in options argument to constructor

        initialize: (options) ->
            _.bindAll(this, 'render', 'unrender', 'toggleMap', 
                'renderStrategyTypeList', 'zoomToTexas')

            @mapView = options.mapView

            return null

        render: () ->
            @$el.empty()
            @$el.html(@template(
                currYear: namespace.currYear
            ))
            ko.applyBindings(this, @el) #need for the hide/show map button

            this.renderStrategyTypeList()
            return this

        renderStrategyTypeList: () ->
            stratTypeLiTemplate = _.template(strategyTypeListItemTpl)

            typeCollection = new StrategyTypeCollection()
            typeCollection.fetch(
                success: (collection) =>
                    for strategyType in collection.models
                        
                        res = this.$('#strategyTypeList').append(
                            stratTypeLiTemplate(
                                m: strategyType.toJSON()
                                currYear: namespace.currYear
                            )
                        )

                    return
            )

            return

        unrender: () ->
            @$el.remove()
            return null

        zoomToTexas: () ->
            @mapView.resetExtent()
            return

        toggleMap: (data, event, x) ->
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