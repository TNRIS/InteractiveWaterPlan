define([
    'namespace'
    'scripts/text!templates/yearNav.html'
],
(namespace, tpl) ->
    
    class YearNavView extends Backbone.View

        template: _.template(tpl)

        initialize: (options) ->
            _.bindAll(this, 'render', 'unrender', 'changeYear', 
                'disableYearButtons', 'enableYearButtons')
            
            return null

        render: () ->
            @$el.empty()

            @currentYear = ko.observable(namespace.currYear)

            @$el.html(@template())

            ko.applyBindings(this, @el)

            #Use the one marked active as the default year to start on
            this.$("a[data-value='#{namespace.currYear}']").parent().addClass('active')

            return this

        disableYearButtons: () ->
            this.$('a').parents('li').addClass('disabled')
            return

        enableYearButtons: () ->
            this.$('a').parents('li').removeClass('disabled')
            return

        unrender: () ->
            kb.release(this)
            @$el.remove()
            return null

        changeYear: (data, event) ->
            $target = $(event.target)

            #fire an event letting listeners know the year has changed
            newYear = $target.attr('data-value')
            this.trigger("changeyear", newYear)

            $target.parent().siblings().removeClass('active')
            $target.parent().addClass('active')
            return null

)