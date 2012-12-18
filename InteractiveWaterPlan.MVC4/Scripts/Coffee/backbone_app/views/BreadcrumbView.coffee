define([
    'scripts/text!templates/breadcrumbList.html'
],
(tpl) ->

    #TODO: Transform into lists to select region or county name
    class BreadcrumbView extends Backbone.View

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
            _.bindAll(this, 'render', 'unrender')
            
            return null

)