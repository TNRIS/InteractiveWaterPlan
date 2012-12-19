define([
    'scripts/text!templates/yearNav.html'
],
(tpl) ->
    
    class YearNavView extends Backbone.View

        
        template: _.template(tpl)

        initialize: (options) ->
            _.bindAll(this, 'render', 'unrender', 'changeYear')
            
            #create an KO observable property for the currently selected year
            @currentYear = ko.observable(options.startingYear)
            
            return null

        render: () ->
            @$el.empty()

            @$el.html(@template())

            ko.applyBindings(this, @el)

            #Use the one marked active as the default year to start on
            this.$("a[data-value='#{@currentYear()}']").parent().addClass('active')

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