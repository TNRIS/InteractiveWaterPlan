define([
    'namespace'
    'scripts/text!templates/countyNetSupplyRow.html'
],
(namespace, tpl) ->

    class CountyNetSupplyView extends Backbone.View

        tagName: 'tr'

        initialize: () ->
            _.bindAll(this, 'render', 'unrender')

            @template = _.template(tpl)

            return null

        render: () ->
            @$el.html(
                @template(
                    m: @model.toJSON()
                    currYear: namespace.currYear
                )
            )

            return this

        unrender: () ->
            @$el.remove()
            return null

)