define([
    'collections/StrategyCollection'
    'views/StrategyView'
    'scripts/text!templates/strategyTable.html'
],
(StrategyCollection, StrategyView, tpl) ->
    class StrategyCollectionView extends Backbone.View

        initialize: () ->
            
            #pass options { collection, el }

            _.bindAll(this, 'render', 'unrender', 'fetchCollection', 'appendModel',
                'hideLoading', 'showLoading')

            @template = _.template(tpl)

            @collection = new StrategyCollection()

            return null

        render: () ->
            @$el.html(this.template())

            this.fetchCollection()

            #make sortable
            sortTable = this.$('table').stupidtable()

            #Add a listener to show FontAwesome up/down icons based on direction of sort
            sortTable.on('aftertablesort', (evt, data) ->
                $th = $('th',this)
                $('i', $th).remove()
                iconClass = if data.direction == "asc" then 'icon-caret-up' else 'icon-caret-down'
                $th.eq(data.column).prepend("<i class='#{iconClass}'></i> ")
                return null
            )

            return this

        unrender: () ->
            @$el.remove()
            return null

        fetchCollection: () ->
            this.showLoading()
            @collection.fetch(
                #data:
                #   year: selectedYear
                success: (collection) =>
                    for m in collection.models
                        this.appendModel(m)

                    this.hideLoading()

                    return null   
            )
            return null

        appendModel: (model) ->
            modelView = new StrategyView(
                model: model
            )

            this.$('tbody').append(modelView.render().el)

            return null

        showLoading: () ->
            this.$('.loading').show()
            return null

        hideLoading: () ->
            this.$('.loading').hide()
            return null
)