define([
    'scripts/text!templates/strategyTypeListItem.html'
    'scripts/text!templates/themeNav.html'
],
(strategyTypeListItemTpl, tpl) ->
    
    class ThemeNavView extends Backbone.View

        template: _.template(tpl)

        initialize: () ->

            _.bindAll(this, 'render', 'unrender', 'changeStrategyView')
            

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
                        
                    ko.applyBindings(this, @el)
                    return
            )

            ko.applyBindings(this, @el)

            return this

        unrender: () ->
            @$el.remove()
            return null

        changeStrategyView: (data, event) ->
            $target = $(event.target)
            newStrategyName = $target.attr('data-value')
            
            #TODO: Really, this needs to load a list of all Strategy types
            # and generate links to view all the strategies by that type

            #TODO: Should it change based on year?

            $target.parents('li.dropdown').addClass('active')
            $target.parents('li.dropdown')
                .children('a.dropdown-toggle')
                .children('span')
                .html($target.html())

            return null



)