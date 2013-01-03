define([
    'scripts/text!templates/strategyRow.html'
],
(tpl) ->

    class StrategyView extends Backbone.View

        tagName: 'tr'

        initialize: (options) ->
            super options

            @currYear = options.currYear

            _.bindAll(this, 'render', 'unrender')

            @template = _.template(tpl)

            return null

        render: () ->

            @$el.html(
                @template(
                    m: @model.toJSON()
                    currYear: @currYear
                )
            )

            return this

        unrender: () ->
            @$el.remove()
            return null

)