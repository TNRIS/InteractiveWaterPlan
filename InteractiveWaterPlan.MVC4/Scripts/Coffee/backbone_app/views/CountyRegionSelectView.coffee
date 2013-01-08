define([
    'namespace'
],
(namespace) ->

    class CountyRegionSelectView extends Backbone.View

        #TODO: Add methods to reset selects (ie, choose the "Select a Region") option

        initialize: (options) ->
            _.bindAll(this, 'render', 'unrender')

            if not options.counties? or not options.regions
                throw "Must specify options.counties and options.regions"
                #TODO: or could call populate those collections asynchronously 

            @countyNamesCollection = options.counties
            @regionNamesCollection = options.regions

            return


        render: () ->
            #create a countySelect and a regionSelect
            
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
                router.navigate("wms/region/#{$this.val()}", {trigger: true})
                return
            )

            #create the countySelect
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
                router.navigate("wms/county/#{$this.val()}", {trigger: true})
                return
            )

            #turn them into chosen.js boxes
            @$countySelect.chosen()
            @$regionSelect.chosen()

            return this

        unrender: () ->
            @$el.remove();
            return null

        
)   