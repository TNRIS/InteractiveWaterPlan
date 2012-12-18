define([
    'scripts/text!templates/breadcrumbList.html'
],
(tpl) ->

    #TODO: Transform into lists to select region or county name
    class BreadcrumbView extends Backbone.View

        template: _.template(tpl)

        initialize: () ->
            _.bindAll(this, 'render', 'unrender', 'selectNetCounty')
            
            @selectedStrategyView = ko.observable()

            return null

        render: () ->
            @$el.empty()

            @$el.html(@template())

            ko.applyBindings(this, @el)

            return this

        unrender: () ->
            @$el.remove()
            return null

        selectNetCounty: () ->
            @selectedStrategyView.notifySubscribers('net-supplies')
            return

)