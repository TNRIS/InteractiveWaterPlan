define([
    'namespace'
    'collections/StrategyTypeCollection'
    'scripts/text!templates/strategyTypeListItem.html'
    'scripts/text!templates/themeNav.html'
],
(namespace, StrategyTypeCollection, strategyTypeListItemTpl, tpl) ->
    
    class ThemeNavToolbarView extends Backbone.View

        template: _.template(tpl)
        

        initialize: (options) ->
            _.bindAll(this, 'render', 'unrender', 'renderStrategyTypeList')

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

        
)