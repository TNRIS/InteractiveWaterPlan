define([
    'namespace'
    'scripts/text!templates/yearNav.html'
],
(namespace, tpl) ->
    
    class YearNavView extends Backbone.View

        template: _.template(tpl)

        initialize: (options) ->
            _.bindAll(this, 'render', 'unrender', 'changeYear')
            
            return null

        render: () ->
            @$el.empty()

            @currentYear = ko.observable(namespace.currYear)

            @$el.html(@template())

            ko.applyBindings(this, @el)

            #Use the one marked active as the default year to start on
            this.$("a[data-value='#{namespace.currYear}']").parent().addClass('active')

            return this

        unrender: () ->
            kb.release(this)
            @$el.remove()
            return null

        #called via KO bindings in the template
        changeYear: (data, event) ->
            $target = $(event.target)

            #set the observable to the newly selected year
            @currentYear($target.data('value'))

            $target.parent().siblings().removeClass('active')
            $target.parent().addClass('active')
            return null

)