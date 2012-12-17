define([
    'scripts/text!templates/yearNav.html'
],
(tpl) ->
    
    class YearNavView extends Backbone.View

        activeYear: '2040'

        template: _.template(tpl)

        render: () ->
            @$el.empty()

            @$el.html(@template())

            ko.applyBindings(this, @el)

            #Use the one marked active as the default year to start on
            this.$("a[data-value='#{@activeYear}']").parent().addClass('active')

            return this

        unrender: () ->
            kb.release(this)
            @$el.remove()
            return null

        initialize: () ->
            _.bindAll(this, 'render', 'unrender', 'changeYear')
            
            return null

        changeYear: (data, event) ->
            $target = $(event.target)
            newYear = $target.attr('data-value')

            #TODO: ko.observable for this

            $target.parent().siblings().removeClass('active')
            $target.parent().addClass('active')
            return null

)