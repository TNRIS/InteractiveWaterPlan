define([
    'namespace'
    'scripts/text!templates/strategyDetailRow.html'
],
(namespace, tpl) ->

    class StrategyDetailView extends Backbone.View

        tagName: 'tr'

        initialize: (options) ->
            super options

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