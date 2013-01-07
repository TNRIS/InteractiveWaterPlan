define([
    'scripts/text!templates/breadcrumbListItem.html'
    'scripts/text!templates/breadcrumbList.html'
],
(breadcrumbListItemTpl, breadcrumbListTpl) ->

    class BreadcrumbView extends Backbone.View

        initialize: () ->
            _.bindAll(this, 'render', 'unrender', 'push', 'pop')
            
            @template = _.template(breadcrumbListTpl)
            @bcItemTemplate = _.template(breadcrumbListItemTpl)

            return null

        render: () ->
            @$el.empty()

            @$el.html(@template())

            return this

        unrender: () ->
            @$el.remove()
            return null

        push: (name, type, id, displayName) ->
            #displayName is what to show in the BC link
            #type can be county, region, net-supplies, district
            #id is the unique placeId
            if not displayName?
                switch type
                    when 'county' then displayName = "#{name} County"
                    when 'region' then displayName = "Region #{name}"
                    else displayName = name

            bcModel = 
                name: name
                type: type
                id: id
                displayName: displayName

            #render html and apply KO bindings
            html = @bcItemTemplate({m: bcModel})
 
            #append it to the breadcrumbList
            res = this.$('ul').append(html)
            
            return

        pop: () ->
            return this.$('ul li:last').remove()

)