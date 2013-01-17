define([
    'namespace'
],
(namespace) ->
    class BaseTableCollectionView extends Backbone.View

        
        initialize: (ModelView, Collection, tpl, options) ->
            _.bindAll(this, 'render', 'unrender', 'fetchCollection', 'appendModel',
                'hideLoading', 'showLoading', 'fetchCallback', '_setupDataTable',
                '_connectTableRowsToWugFeatures', 'showNothingFound', 'hideNothingFound')

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

            
            this.$('tbody').empty() #clear the table contents

            #always include the current year in the fetch parameters
            params = _.extend({year: namespace.currYear }, @fetchParams)

            this.trigger("table:startload")

            @collection.fetch(
                data: params
                
                success: (collection) =>
                    
                    if collection.models.length == 0
                        this.trigger("table:nothingfound")

                    else
                        for m in collection.models
                            this.appendModel(m)

                        this.$('.has-popover').popover(trigger: 'hover')

                        this._setupDataTable()

                        this._connectTableRowsToWugFeatures()

                        if this.fetchCallback? and _.isFunction(this.fetchCallback)
                            this.fetchCallback(collection.models)

                        this.trigger("table:endload")

                    return   

                error: () =>
                    this.trigger("table:fetcherror")
                    return
            )

            return

        fetchCallback: (strategyModels) ->
            #Use underscore to map WUG properties to new WUG object
            # and then add them all to the namespace.wugFeatureCollection
            console.log "models lenght", strategyModels.length
            newWugList = _.map(strategyModels, (m) ->
                return {
                    entityId: m.get("recipientEntityId")
                    projectId: m.get("projectId")
                    name: m.get("recipientEntityName")
                    wktGeog: m.get("recipientEntityWktGeog")
                    sourceSupply: m.get("supply#{namespace.currYear}")
                    type: m.get("recipientEntityType")
                    stratTypeId: m.get("typeId")
                }
            )

            namespace.wugFeatureCollection.reset(newWugList)
            return


        _setupDataTable: () ->
            #grab the table, get the headers
            # for each th, grab the data-sort attribute
            # and put its value in the column config
            $table = this.$('table')
            dtColConfig = []
            $('th', $table).each((i, th) ->
                $th = $(th)
                if $th.attr('data-sort')?
                    dtColConfig.push({sType: $(th).attr('data-sort')})
                else
                    dtColConfig.push(null)
            )

            $table.dataTable(
                bDestroy: true
                sPaginationType: "bootstrap",
                aLengthMenu: [[10, 25, 50, 100, 99999], [10, 25, 50, 100, "All"]]
                aoColumns: dtColConfig
            )

            return


        #Attach hover listener to the data table to show a popup for the associated WUG Feature
        _connectTableRowsToWugFeatures: () ->

            me = this #save reference to the View

            this.$('td.strategyType').hover(
                (evt) -> #hoverIn
                    console.log "in", this
                    #TODO: highlight wug features of the same type
                    return
                (evt) -> #hoverOut
                    console.log "out", this
                    #TODO: unhighlight all wug features
                    return
            )

            this.$('table tbody').delegate('tr', 'hover', #delegates to tr
                (event) ->
                    if event.type == 'mouseenter'
                        $target = $(this) #this = tr

                        #grab entity-id from the parent tr
                        wugId = parseInt($target.attr('data-entity-id'))
                        projectId = parseInt($target.attr('data-project-id'))
                        
                        #trigger the event passing wugId and projectId
                        me.trigger("table:hoverwug", wugId, projectId)
                    else
                        #trigger the event passing null as the id
                        me.trigger("table:hoverwug", null)

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
            $('#nothingFoundMessage').fadeIn()
            @$el.hide()
            return

        hideNothingFound: () ->
            $('#nothingFoundMessage').hide()
            return

        showLoading: () ->
            @$el.hide()
            this.hideNothingFound()
            $('.tableLoading').show()
            return

        hideLoading: () ->
            $('.tableLoading').hide()
            @$el.fadeIn()
            return


)