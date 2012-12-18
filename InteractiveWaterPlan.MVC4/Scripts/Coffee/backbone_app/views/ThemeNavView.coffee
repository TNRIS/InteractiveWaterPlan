define([
    'scripts/text!templates/strategyTypeListItem.html'
    'scripts/text!templates/themeNav.html'
],
(strategyTypeListItemTpl, tpl) ->
    
    class ThemeNavView extends Backbone.View

        template: _.template(tpl)

        initialize: () ->

            _.bindAll(this, 'render', 'unrender', 'toggleMap', 'changeStrategyView')
            

            return null

        render: () ->
            @$el.empty()
            @$el.html(@template())

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

            ko.applyBindings(this, @el)

            return this

        unrender: () ->
            @$el.remove()
            return null

        toggleMap: (data, target) ->
            $target = $(event.target)

            if $target.hasClass('off')
                $target.html('Hide Map')
                $('#mapContainer').show()
                $('#mapTools').show()
                $target.removeClass('off')

            else
                $target.addClass('off')
                $('#mapContainer').hide()
                $('#mapTools').hide()
                $target.html('Show Map')

            return

        changeStrategyView: (data, event) ->
            $target = $(event.target)
            newStrategyName = $target.attr('data-value')

            $target.parents('li.dropdown').addClass('active')
            
            txt = 'Water Management Strategies'
            if newStrategyName != 'all'
                txt = $target.html()
            
            $target.parents('li.dropdown')
                .children('a.dropdown-toggle')
                .children('span')
                .html(txt)

            return null



)