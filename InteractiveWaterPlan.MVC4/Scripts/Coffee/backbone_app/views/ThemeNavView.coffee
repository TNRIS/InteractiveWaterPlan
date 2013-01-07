define([
    'collections/StrategyTypeCollection'
    'scripts/text!templates/strategyTypeListItem.html'
    'scripts/text!templates/themeNav.html'
],
(StrategyTypeCollection, strategyTypeListItemTpl, tpl) ->
    
    class ThemeNavView extends Backbone.View

        template: _.template(tpl)

        initialize: () ->

            _.bindAll(this, 'render', 'unrender', 'toggleMap', 
                'renderStrategyTypeList')
            


            return null

        render: () ->
            @$el.empty()
            @$el.html(@template())
            ko.applyBindings(this, @el)

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
                            )
                        )

                    return
            )

            return

        unrender: () ->
            @$el.remove()
            return null

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