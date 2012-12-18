define([
    'scripts/text!templates/themeNav.html'
],
(tpl) ->
    
    class ThemeNavView extends Backbone.View

        template: _.template(tpl)

        render: () ->
            @$el.empty()

            @$el.html(@template())

            ko.applyBindings(this, @el)

            return this

        unrender: () ->
            kb.release(this)
            @$el.remove()
            return null

        initialize: () ->

            _.bindAll(this, 'render', 'unrender', 'changeStrategyView')
            
            return null

        changeStrategyView: (data, event) ->
            $target = $(event.target)
            newStrategyName = $target.attr('data-value')
            
            #TODO: Really, this needs to load a list of all Strategy types
            # and generate links to view all the strategies by that type

            #TODO: Shoul dit change based on year?

            $target.parents('li.dropdown').addClass('active')
            $target.parents('li.dropdown')
                .children('a.dropdown-toggle')
                .children('span')
                .html($target.html())

            return null



)