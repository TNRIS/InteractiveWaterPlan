define([
    'scripts/text!templates/strategyTypeListItem.html'
    'scripts/text!templates/themeNav.html'
],
(strategyTypeListItemTpl, tpl) ->
    
    class ThemeNavView extends Backbone.View

        template: _.template(tpl)

        initialize: () ->

            _.bindAll(this, 'render', 'unrender', 'toggleMap', 'renderStrategyTypeList', 
                'changeStrategyView')
            
            return null

        render: () ->
            @$el.empty()
            @$el.html(@template())

            this.renderStrategyTypeList()

            ko.applyBindings(this, @el)

            return this

        renderStrategyTypeList: () ->
            stratTypeLiTemplate = _.template(strategyTypeListItemTpl)
            TypeCollection = Backbone.Collection.extend(
                url: "#{BASE_API_PATH}api/strategy/type/all"
            )

            typeCollection = new TypeCollection()
            typeCollection.fetch(
                success: (collection) =>
                    for strategyType in collection.models
                        
                        this.$('#strategyTypeList').append(
                            stratTypeLiTemplate(
                                m: strategyType.toJSON()
                            )
                        )

                    ko.applyBindings(this, $('#strategyTypeList')[0])
                    return
            )

            return

        unrender: () ->
            @$el.remove()
            return null

        toggleMap: (data, target) ->
            $target = $(event.target)

            if $target.hasClass('off')
                $target.html('Hide Map')
                $('#mapContainer').show()
                $('.map-stuff').show()
                $target.removeClass('off')

            else
                $target.addClass('off')
                $('#mapContainer').hide()
                $('.map-stuff').hide()
                $target.html('Show Map')

            return

        changeStrategyView: (data, event) ->
            $target = $(event.target)
            newStrategyName = $target.data('value')

            $target.parents('li.dropdown').addClass('active')
            
            txt = 'Water Management Strategies'
            if newStrategyName != 'net-county'
                txt = $target.html()
            
            $target.parents('li.dropdown')
                .children('a.dropdown-toggle')
                .children('span')
                .html(txt)

            return null



)