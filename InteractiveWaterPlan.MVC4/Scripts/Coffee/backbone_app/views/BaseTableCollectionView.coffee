define([
],
() ->
    class BaseTableCollectionView extends Backbone.View

        currYear: null #reference to the currently selected year

        fetchCallback: null #optional holder for callback after collection fetch has completed successfully

        initialize: (currYear, ModelView, Collection, tpl, options) ->
            _.bindAll(this, 'render', 'unrender', 'fetchCollection', 'appendModel',
                'hideLoading', 'showLoading', 'changeToYear', 
                '_makeTableSortable')

            @currYear = ko.observable(currYear)
            
            options = options || {}
            @fetchParams = options.fetchParams || {}
            
            @template = _.template(tpl)

            @collection = new Collection()

            @ModelView = ModelView

            return null

        render: () ->
            @$el.html(this.template())

            this.fetchCollection()

            #make sortable
            this._makeTableSortable()
            
            ko.applyBindings(this, @el)
            
            this.$('.has-popover').popover(
                trigger: 'hover'
                placement: 'top'
            )

            return this

        unrender: () ->
            @$el.html()
            return null

        fetchCollection: () ->
            this.showLoading()
            
            this.$('tbody').empty() #clear the table contents

            params = _.extend({year: @currYear() }, @fetchParams)

            @collection.fetch(
                data: params
                
                success: (collection) =>
                    for m in collection.models
                        this.appendModel(m)

                    this.hideLoading()

                    #apply KO bindings after rendering all the collection model views
                    ko.applyBindings(this, this.$('tbody')[0]) 

                    if this.fetchCallback? and _.isFunction(this.fetchCallback)
                        this.fetchCallback(collection.models)

                    return   
            )

            return

        appendModel: (model) ->

            modelView = new @ModelView(
                model: model
                currYear: @currYear()
            )

            this.$('tbody').append(modelView.render().el)

            return null

        showLoading: () ->
            this.$('.scrollTableContainer').hide()
            this.$('.loading').show()
            return null

        hideLoading: () ->
            this.$('.loading').hide()
            this.$('.scrollTableContainer').fadeIn()
            return null

        changeToYear: (newYear) ->
            @currYear(newYear)
            this.fetchCollection()
            return

        _makeTableSortable: () ->
            sortTable = this.$('table').stupidtable(
                #special sort method for formatted numbers (ie, they have commas)
                "formatted-int": (a, b) -> 
                    a = parseInt(a.replace(/,/g,""))
                    b = parseInt(b.replace(/,/g,""))
                    if a < b then return -1
                    if a > b then return 1
                    return 0

                "formatted-currency": (a, b) ->
                    a = parseInt(a.replace(/,/g,"").replace("$", ""))
                    b = parseInt(b.replace(/,/g,"").replace("$", ""))
                    if a < b then return -1
                    if a > b then return 1
                    return 0
            )

            #Add a listener to show FontAwesome up/down icons based on direction of sort
            sortTable.on('aftertablesort', (evt, data) ->
                $th = $('th',this)
                $('i', $th).remove()
                iconClass = if data.direction == "asc" then 'icon-caret-up' else 'icon-caret-down'
                $th.eq(data.column).prepend("<i class='#{iconClass}'></i> ")
                return null
            )

            return

)