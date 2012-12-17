define([
    'scripts/text!templates/breadcrumbList.html'
],
(tpl) ->

    class BreadcrumbViewModel extends Backbone.View

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