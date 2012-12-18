define([
    'scripts/text!templates/strategyRow.html'
],
(tpl) ->

    class StrategyView extends Backbone.View

        tagName: 'tr'

        initialize: () ->
            _.bindAll(this, 'render', 'unrender')

            @template = _.template(tpl)

            return null

        render: () ->
            @$el.html(
                @template(
                    m: @model.toJSON()
                )
            )

            return this

        unrender: () ->
            @$el.remove()
            return null

)