define([
    'namespace'
],
(namespace) ->

    class WmsAreaSelectView extends Backbone.View

        #TODO: Add methods to reset selects (ie, choose the "Select a Region") option

        initialize: (options) ->
            _.bindAll(this, 'render', 'unrender', 
                '_createRegionSelect', '_createCountySelect', 
                '_createHouseSelect', '_createSenateSelect',
                'enableSelects', 'disableSelects', 'resetSelects')

            if (not namespace.countyNames? or not namespace.regionNames? or 
                not namespace.houseNames? or not namespace.senateNames?)
                    throw "Must specify namespace.counties, namespace.regions, namespace.house,and namespace.senate"

            return

        render: () ->
            @selects = {}
            #create the regionSelect
            @selects["region"] = this._createRegionSelect().chosen()
            
            #create the countySelect
            @selects["county"] = this._createCountySelect().chosen()

            #create the houseSelect
            @selects["house"] = this._createHouseSelect().chosen() 

            #create the senateSelect
            @selects["senate"] = this._createSenateSelect().chosen()

            return this

        resetSelects: (exceptName) ->
            for select of @selects
                if select != exceptName
                    @selects[select].val("-1").trigger("liszt:updated")

            return

        disableSelects: () ->
            for select of @selects
                @selects[select].attr('disabled', true).trigger("liszt:updated")

            return

        enableSelects: () ->
            for select of @selects
                @selects[select].attr('disabled', null).trigger("liszt:updated")

            return

        _createRegionSelect: () ->
            $regionSelect = $("<select></select>")
            $regionSelect.append($("<option value='-1'>Select a Region</option>"))
            for region in namespace.regionNames.models
                opt = $("<option value='#{region.get("letter")}'>Region #{region.get("letter")}</option>")
                $regionSelect.append(opt)

            #add it to the dom
            this.$("#regionSelectContainer").append($regionSelect)

            #trigger the router to navigate to the view for this county
            me = this
            $regionSelect.on("change", () ->
                $this = $(this)
                if $this.val() == "-1" then return
                Backbone.history.navigate("#/#{namespace.currYear}/wms/region/#{$this.val()}", {trigger: true})
                me.resetSelects("region")
                return
            )
            return $regionSelect

        _createCountySelect: () ->
            $countySelect = $("<select></select>")
            $countySelect.append($("<option value='-1'>Select a County</option>"))
            for county in namespace.countyNames.models
                opt = $("<option value='#{county.get("id")}'>#{county.get("name")}</option>")
                $countySelect.append(opt)

            #add it to the dom
            this.$("#countySelectContainer").append($countySelect)

            #trigger the router to navigate to the view for this county
            me = this
            $countySelect.on("change", () ->
                $this = $(this)
                if $this.val() == "-1" then return
                Backbone.history.navigate("#/#{namespace.currYear}/wms/county/#{$this.val()}", {trigger: true})
                me.resetSelects("county")
                return
            )
            return $countySelect

        _createHouseSelect: () ->
            $houseSelect = $("<select></select>")
            $houseSelect.append($("<option value='-1'>Select a State House District</option>"))
            for district in namespace.houseNames.models
                opt = $("<option value='#{district.get("id")}'>#{district.get("name")}</option>")
                $houseSelect.append(opt)

            #add it to the dom
            this.$("#houseSelectContainer").append($houseSelect)

            #trigger the router to navigate to the view for this district
            me = this
            $houseSelect.on("change", () ->
                $this = $(this)
                if $this.val() == "-1" then return
                Backbone.history.navigate("#/#{namespace.currYear}/wms/house/#{$this.val()}", {trigger: true})
                me.resetSelects("house")
                return
            )
            return $houseSelect


        _createSenateSelect: () ->
            $houseSelect = $("<select></select>")
            $houseSelect.append($("<option value='-1'>Select a State Senate District</option>"))
            for district in namespace.senateNames.models
                opt = $("<option value='#{district.get("id")}'>#{district.get("name")}</option>")
                $houseSelect.append(opt)

            #add it to the dom
            this.$("#senateSelectContainer").append($houseSelect)

            #trigger the router to navigate to the view for this district
            me = this
            $houseSelect.on("change", () ->
                $this = $(this)
                if $this.val() == "-1" then return
                Backbone.history.navigate("#/#{namespace.currYear}/wms/senate/#{$this.val()}", {trigger: true})
                me.resetSelects("senate")
                return
            )
            return $houseSelect

        unrender: () ->
            @$el.remove();
            return null

        
)   