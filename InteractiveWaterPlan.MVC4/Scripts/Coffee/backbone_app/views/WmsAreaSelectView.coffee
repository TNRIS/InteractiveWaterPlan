define([
    'namespace'
    'scripts/text!templates/wmsAreaSelect.html'
],
(namespace, tpl) ->

    class WmsAreaSelectView extends Backbone.View

        template: _.template(tpl)

        initialize: (options) ->
            _.bindAll(this, 'render', 'unrender', 
                '_createRegionSelect', '_createCountySelect', 
                '_createHouseSenateSelect', '_createWugSelect',
                'enableSelects', 'disableSelects', 'resetSelects')

            if (not namespace.countyNames? or not namespace.regionNames? or 
                not namespace.houseNames? or not namespace.senateNames?)
                    throw "Must specify namespace.counties, namespace.regions, namespace.house,and namespace.senate"

            return

        render: () ->
            @$el.empty()
            @$el.html(@template())

            @selects = {}
            #create the regionSelect
            @selects["region"] = this._createRegionSelect().chosen()
            
            #create the countySelect
            @selects["county"] = this._createCountySelect().chosen()

            #create the houseSenateSelect
            @selects["district"] = this._createHouseSenateSelect().chosen() 

            #create the wugSelect, which is ajax-backed
            @selects["wug"] = this._createWugSelect().ajaxChosen(
                type: 'GET'
                url: "#{BASE_PATH}api/entities/auto"
                jsonTermKey: "namePart"
                , (data) ->
                    results = []
                    for kvp in data
                        results.push(value: kvp.id, text: kvp.name)
                    return results 
            )

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

        _createHouseSenateSelect: () ->
            $houseSenateSelect = $("<select></select>")
            $houseSenateSelect.append($("<option value='-1'>Select a Legislative District</option>"))
            
            for district in namespace.senateNames.models
                opt = $("<option data-type='senate' value='#{district.get("id")}'>#{district.get("name")}</option>")
                $houseSenateSelect.append(opt)

            for district in namespace.houseNames.models
                opt = $("<option data-type='house' value='#{district.get("id")}'>#{district.get("name")}</option>")
                $houseSenateSelect.append(opt)

            #add it to the dom
            this.$("#districtSelectContainer").append($houseSenateSelect)

            #trigger the router to navigate to the view for this district
            me = this
            $houseSenateSelect.on("change", () ->
                $this = $(this)
                if $this.val() == "-1" then return
                districtType = $this.attr('data-type')

                if districtType == 'senate'
                    Backbone.history.navigate("#/#{namespace.currYear}/wms/senate/#{$this.val()}", {trigger: true})
                else
                    Backbone.history.navigate("#/#{namespace.currYear}/wms/house/#{$this.val()}", {trigger: true})
                
                me.resetSelects("district")
                return
            )
            return $houseSenateSelect

        _createWugSelect: () ->
            $wugSelect = $("<select></select>")
            $wugSelect.append($("<option value='-1'>Search for a Water User Group</option>"))
            
            this.$("#wugSelectContainer").append($wugSelect)

            #trigger the router to navigate to the view for this county
            me = this
            $wugSelect.on("change", () ->
                $this = $(this)
                if $this.val() == "-1" then return
                Backbone.history.navigate("#/#{namespace.currYear}/wms/entity/#{$this.val()}", {trigger: true})
                me.resetSelects("wug")
                return
            )

            return $wugSelect

        unrender: () ->
            @$el.remove();
            return null

        
)   