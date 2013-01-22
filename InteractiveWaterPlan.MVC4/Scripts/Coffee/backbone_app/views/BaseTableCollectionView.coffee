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
           
            #Use some sweet underscore.js methods to
            #first group the returned strategies by ID
            # then reduce those groups to a single WUG (which will become a feature on the map)

            groupedById = _.groupBy(strategyModels, (m) ->
                return m.get("recipientEntityId")
            )

            #map to a new array, reducing each group to a single WUG
            newWugList = _.map(groupedById, 
                (group) ->
                    entity = _.reduce(group, 
                        (memo, m)->
                            
                            #these properties should not change
                            memo.entityId = m.get("recipientEntityId")
                            memo.name = m.get("recipientEntityName")
                            memo.wktGeog = m.get("recipientEntityWktGeog")
                            memo.type = m.get("recipientEntityType")
                            
                            #add each type to the list of types
                            memo.strategyTypes.push(m.get("typeId"))

                            #add to the calculated total supply
                            memo.totalSupply += m.get("supply#{namespace.currYear}")

                            return memo
                        {
                            totalSupply: 0
                            strategyTypes: []
                        }
                    )

                    #make sure strategyTypes are not duplicated
                    entity.strategyTypes = _.uniq(entity.strategyTypes)
                    return entity
            )

            #Sort the features so that WWP type features are first
            # then sorty by totalSupply, largest to smallest,
            # so that the features draw appropriately (big behind small)
            newWugList.sort((a, b) ->
                #first check the type
                if a.type == "WWP" then return -1
                if b .type == "WWP" then return 1

                #then check the supply value
                return b.totalSupply - a.totalSupply
            )
            

            #Reset the shared namespace collection to trigger the map to update
            # which features it shows
            namespace.wugFeatureCollection.reset(newWugList)
            return


        _mapStrategyModelToWugFeature: (m) ->
            return {
                entityId: m.get("recipientEntityId")
                name: m.get("recipientEntityName")
                wktGeog: m.get("recipientEntityWktGeog")
                totalSupply: m.get("supply#{namespace.currYear}")
                type: m.get("recipientEntityType")
                stratTypeId: m.get("typeId")
            }

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

            #Must use delegate methods because the table has not finished rendering
            # by the time this is called (because the models are independently appended)

            this.$('table tbody').delegate('td.strategyType', 'hover'
                (event) -> 
                    if event.type == 'mouseenter' #hoverIn
                        #trigger an event to let the map know to
                        # highlight wug features of with the strategy type
                        typeId = parseInt($(this).attr('data-type-id'))
                        me.trigger("table:hovertype", typeId)
                    
                
                    else #hover out
                        #trigger the event with null to clear type-highlighted features
                        me.trigger("table:hovertype", null)
                    return
            )

            this.$('table tbody').delegate('tr', 'hover', #delegates to tr
                (event) ->
                    if event.type == 'mouseenter'
                        $target = $(this) #this = tr

                        #grab entity-id from the parent tr
                        wugId = parseInt($target.attr('data-entity-id'))
                        
                        #trigger the event passing wugId
                        me.trigger("table:hoverwug", wugId)
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