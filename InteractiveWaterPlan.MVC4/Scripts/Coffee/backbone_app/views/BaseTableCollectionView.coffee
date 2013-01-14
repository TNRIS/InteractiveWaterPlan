define([
    'namespace'
],
(namespace) ->
    class BaseTableCollectionView extends Backbone.View

        
        initialize: (ModelView, Collection, tpl, options) ->
            _.bindAll(this, 'render', 'unrender', 'fetchCollection', 'appendModel',
                'hideLoading', 'showLoading', 'fetchCallback', 'connectTableRowsToWugFeatures'
                '_makeTableSortable')

            options = options || {}
            @fetchParams = options.fetchParams || {}
            
            @currYear = ko.observable(namespace.currYear)

            @template = _.template(tpl)

            @collection = new Collection()

            @ModelView = ModelView

            return null

        render: () ->
            @$el.html(this.template())

            this.fetchCollection()

            #This observable is used to let the MapView to select a WUG
            @selectedWug = ko.observable()

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

            this.hideNothingFound()
            this.showLoading()
            
            this.$('tbody').empty() #clear the table contents

            #always include the current year in the fetch parameters
            params = _.extend({year: namespace.currYear }, @fetchParams)

            @collection.fetch(
                data: params
                
                success: (collection) =>
                    
                    if collection.models.length > 0
                        for m in collection.models
                            this.appendModel(m)

                        this.hideLoading()

                    else
                        this.hideLoading()
                        this.showNothingFound()
                        

                    this.connectTableRowsToWugFeatures()

                    if this.fetchCallback? and _.isFunction(this.fetchCallback)
                        this.fetchCallback(collection.models)


                    return   
            )

            return

        fetchCallback: (strategyModels) ->
            #Use underscore to map WUG properties to new WUG object
            # and then add them all to the namespace.wugFeatureCollection
            newWugList = _.map(strategyModels, (m) ->
                return {
                    id: m.get("recipientEntityId")
                    name: m.get("recipientEntityName")
                    wktGeog: m.get("recipientEntityWktGeog")
                    sourceSupply: m.get("supply#{namespace.currYear}")
                }
            )

            namespace.wugFeatureCollection.reset(newWugList)
            return


        #Attach hover listener to the data table to show a popup for the associated WUG Feature
        connectTableRowsToWugFeatures: () ->

            me = this #save reference to the View
            this.$('table tbody').delegate('tr', 'hover', #delegates to tr
                (event) ->
                    if event.type == 'mouseenter'
                        $target = $(this) #this = tr

                        #grab entity-id from the parent tr
                        wugId = $target.data('entity-id')
                        
                        #update the observable to trigger the event
                        me.selectedWug(wugId)
                    else
                        me.selectedWug(null) #select none (hides the map popup)
                        
                    return
            )

            return

        appendModel: (model) ->

            modelView = new @ModelView(
                model: model
                currYear: namespace.currYear
            )

            this.$('tbody').append(modelView.render().el)

            return

        showNothingFound: () ->
            $('#nothingFound').fadeIn()
            $('.scrollTableContainer').hide()
            return

        hideNothingFound: () ->
            $('#nothingFound').hide()

            return

        showLoading: () ->
            this.$('.scrollTableContainer').hide()
            $('.tableLoading').show()
            return

        hideLoading: () ->
            $('.tableLoading').hide()
            this.$('.scrollTableContainer').fadeIn()
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
                $('i.icon-caret-up', $th).remove()
                $('i.icon-caret-down', $th).remove()
                iconClass = if data.direction == "asc" then 'icon-caret-up' else 'icon-caret-down'
                $th.eq(data.column).prepend("<i class='#{iconClass}'></i> ")
                return null
            )

            return

)