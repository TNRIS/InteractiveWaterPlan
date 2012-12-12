define([
    'scripts/text!templates/yearNav.html'
],
(tpl) ->
    
    class YearNavViewModel extends Backbone.View

        activeYear: '2040'

        template: _.template(tpl)

        render: () ->
            @$el.empty()

            @$el.html(@template())

            ko.applyBindings(this, @el)

            #Use the one marked active as the default year to start on
            $("a[data-value='#{@activeYear}']", @$el).parent().addClass('active')

            return this

        unrender: () ->
            @$el.remove()
            return null

        initialize: () ->
            @$el = $(@el)

            _.bindAll(this, 'render', 'unrender', 'changeYear')
            
            return null

        changeYear: (data, event) ->
            $target = $(event.target)
            newYear = $target.attr('data-value')

            $target.parent().siblings().removeClass('active')
            $target.parent().addClass('active')
            console.log "Switching to year #{newYear}"
            return null

)