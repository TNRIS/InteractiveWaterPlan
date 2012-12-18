define([
],
() ->
    class BaseTableCollectionView extends Backbone.View

        currYear: null #reference to the currently selected year

        initialize: (startingYear, ModelView, Collection, tpl) ->
            _.bindAll(this, 'render', 'unrender', 'fetchCollection', 'appendModel',
                'hideLoading', 'showLoading', 'changeToYear')

            @currYear = startingYear

            @template = _.template(tpl)

            @collection = new Collection()

            @ModelView = ModelView

            #Apply KO bindings
            ko.applyBindings(this, @el)

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
            
            this.$('tbody').empty() #clear the table contents

            @collection.fetch(
                data:
                   year: @currYear #use the currently selected year

                success: (collection) =>
                    for m in collection.models
                        this.appendModel(m)

                    this.hideLoading()

                    return null   
            )
            return null

        appendModel: (model) ->
            modelView = new @ModelView(
                model: model
            )

            this.$('tbody').append(modelView.render().el)

            return null

        changeToYear: (newYear) ->
            @currYear = newYear
            this.fetchCollection()
            return

        showLoading: () ->
            this.$('.loading').show()
            return null

        hideLoading: () ->
            this.$('.loading').hide()
            return null

)