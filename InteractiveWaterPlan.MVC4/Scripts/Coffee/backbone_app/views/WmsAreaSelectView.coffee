define([
    'namespace'
],
(namespace) ->

    class WmsAreaSelectView extends Backbone.View

        #TODO: Add methods to reset selects (ie, choose the "Select a Region") option

        initialize: (options) ->
            _.bindAll(this, 'render', 'unrender', 
                '_createRegionSelect', '_createCountySelect', 
                '_createHouseSelect', '_createSenateSelect')

            if (not namespace.countyNames? or not namespace.regionNames? or 
                not namespace.houseNames? or not namespace.senateNames?)
                    throw "Must specify namespace.counties, namespace.regions, namespace.house,and namespace.senate"
                
            @countyNamesCollection = namespace.countyNames
            @regionNamesCollection = namespace.regionNames
            @houseNamesCollection = namespace.houseNames
            @senateNamesCollection = namespace.senateNames

            return

        render: () ->
            #create the regionSelect
            this._createRegionSelect().chosen()

            #create the countySelect
            this._createCountySelect().chosen()

            #create the houseSelect
            #TODO: include this when ready: this._createHouseSelect().chosen() 

            #create the senateSelect
            #TODO: include this when ready: this._createSenateSelect().chosen()

            return this


        _createRegionSelect: () ->
            @$regionSelect = $("<select></select>")
            @$regionSelect.append($("<option value='-1'>Select a Region</option>"))
            for region in @regionNamesCollection.models
                opt = $("<option value='#{region.get("letter")}'>Region #{region.get("letter")}</option>")
                @$regionSelect.append(opt)

            #add it to the dom
            this.$("#regionSelectContainer").append(@$regionSelect)

            #trigger the router to navigate to the view for this county
            @$regionSelect.on("change", () ->
                $this = $(this)
                if $this.val() == "-1" then return
                Backbone.history.navigate("#/#{namespace.currYear}/wms/region/#{$this.val()}", {trigger: true})
                return
            )
            return @$regionSelect

        _createCountySelect: () ->
            @$countySelect = $("<select></select>")
            @$countySelect.append($("<option value='-1'>Select a County</option>"))
            for county in @countyNamesCollection.models
                opt = $("<option value='#{county.get("id")}'>#{county.get("name")}</option>")
                @$countySelect.append(opt)

            #add it to the dom
            this.$("#countySelectContainer").append(@$countySelect)

            #trigger the router to navigate to the view for this county
            @$countySelect.on("change", () ->
                $this = $(this)
                if $this.val() == "-1" then return
                Backbone.history.navigate("#/#{namespace.currYear}/wms/county/#{$this.val()}", {trigger: true})
                return
            )
            return @$countySelect

        _createHouseSelect: () ->
            @$houseSelect = $("<select></select>")
            @$houseSelect.append($("<option value='-1'>Select a State House District</option>"))
            for district in @houseNamesCollection.models
                opt = $("<option value='#{district.get("id")}'>#{district.get("name")}</option>")
                @$houseSelect.append(opt)

            #add it to the dom
            this.$("#houseSelectContainer").append(@$houseSelect)

            #trigger the router to navigate to the view for this district
            @$houseSelect.on("change", () ->
                $this = $(this)
                if $this.val() == "-1" then return
                #TODO: houseSelect
                #Backbone.history.navigate("#/#{namespace.currYear}/wms/district/house/#{$this.val()}", {trigger: true})
                return
            )
            return @$houseSelect


        _createSenateSelect: () ->
            @$senateSelect = $("<select></select>")
            @$senateSelect.append($("<option value='-1'>Select a State Senate District</option>"))
            for district in @senateNamesCollection.models
                opt = $("<option value='#{district.get("id")}'>#{district.get("name")}</option>")
                @$senateSelect.append(opt)

            #add it to the dom
            this.$("#senateSelectContainer").append(@$senateSelect)

            #trigger the router to navigate to the view for this district
            @$senateSelect.on("change", () ->
                $this = $(this)
                if $this.val() == "-1" then return
                #TODO: senateSelect
                #Backbone.history.navigate("#/#{namespace.currYear}/wms/district/senate/#{$this.val()}", {trigger: true})
                return
            )
            return @$senateSelect

        unrender: () ->
            @$el.remove();
            return null

        
)   