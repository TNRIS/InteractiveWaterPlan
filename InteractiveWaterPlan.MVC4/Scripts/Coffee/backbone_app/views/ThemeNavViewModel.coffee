define([
    'scripts/text!templates/themeNav.html'
],
(tpl) ->
    
    class ThemeNavViewModel extends Backbone.View

        template: _.template(tpl)

        render: () ->
            @$el.empty()

            @$el.html(@template())

            ko.applyBindings(this, @el)

            return this

        unrender: () ->
            @$el.remove()
            return null

        initialize: () ->
            @$el = $(@el)

            _.bindAll(this, 'render', 'unrender', 'changeStrategyView')
            
            return null

        changeStrategyView: (data, event) ->
            $target = $(event.target)
            newStrategyName = $target.attr('data-value')
            
            #TODO: fire some event?

            $target.parents('li.dropdown').addClass('active')
            $target.parents('li.dropdown')
                .children('a.dropdown-toggle')
                .children('span')
                .html($target.html())

            return null



)