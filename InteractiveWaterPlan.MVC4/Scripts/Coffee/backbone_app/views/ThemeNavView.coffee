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
            
            @selectedType = ko.observable()

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
                url: "#{BASE_API_PATH}api/strategy/types"
            )

            typeCollection = new TypeCollection()
            typeCollection.fetch(
                success: (collection) =>
                    for strategyType in collection.models
                        
                        res = this.$('#strategyTypeList').append(
                            stratTypeLiTemplate(
                                m: strategyType.toJSON()
                            )
                        )

                        #bind events to the most recently added a element
                        ko.applyBindings(this, $('a:last', res)[0])
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
                $('#mapContainer').slideDown()
                $('.map-stuff').show()
                $target.removeClass('off')

            else
                $target.addClass('off')
                $('#mapContainer').slideUp()
                $('.map-stuff').hide()
                $target.html('Show Map')

            return

        changeStrategyView: (data, event) ->
            $target = $(event.target)
            newStrategyType = $target.data('type')

            $target.parents('li.dropdown').addClass('active')
            
            txt = 'Water Management Strategies'
            if newStrategyType != 'net-supplies'
                txt = $target.html()
            
            $target.parents('li.dropdown')
                .children('a.dropdown-toggle')
                .children('span')
                .html(txt)

            #Change the observable to notify the app that the view must change
            @selectedType(
                type: $target.data('type')
                id: $target.data('id')
                name: $target.data('name')
            )

            return null



)