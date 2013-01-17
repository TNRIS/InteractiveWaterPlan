define([
    'namespace'
],
(namespace) ->

    class BaseStrategyView extends Backbone.View

        tagName: 'tr'

        initialize: (options) ->

            if not @template? and not options.template?
                throw "Must specify template"

            if options.template? then @template = options.template

            super options

            _.bindAll(this, 'render', 'unrender')

            @template = _.template(@template)

            return null

        render: () ->
            @$el.html(
                @template(
                    m: @model.toJSON()
                    currYear: namespace.currYear
                )
            )

            #save the entityId to the <tr>
            @$el.attr('data-entity-id', @model.get("recipientEntityId"))
            return this

        unrender: () ->
            @$el.remove()
            return null

)