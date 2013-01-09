define([
    'namespace'
    'scripts/text!templates/strategyTypeRow.html'
],
(namespace, tpl) ->

    class StrategyTypeView extends Backbone.View

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