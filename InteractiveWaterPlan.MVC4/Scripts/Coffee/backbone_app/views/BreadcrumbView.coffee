define([
    'scripts/text!templates/breadcrumbListItem.html'
    'scripts/text!templates/breadcrumbList.html'
],
(breadcrumbListItemTpl, breadcrumbListTpl) ->

    #TODO: Transform into lists to select region or county name
    class BreadcrumbView extends Backbone.View

        initialize: () ->
            _.bindAll(this, 'render', 'unrender', 'selectBreadcrumb', 'push', 'pop')
            
            @selectedBreadcrumb = ko.observable()

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
            ko.applyBindings(this, $("a:last", res)[0])

            return

        pop: () ->
            return this.$('ul li:last').remove()

        selectBreadcrumb: (data, event) ->
            $target = $(event.target)
            selectedBreadcrumbOpts = 
                type: $target.data('type')
                id: $target.data('id')
                name: $target.data('name')

            #pop off the breadcrumbs up to and including this one
            nextCrumbs = $target.parent().nextAll()
            this.pop() for i in [0..nextCrumbs.length]

            @selectedBreadcrumb.notifySubscribers(selectedBreadcrumbOpts)

            return
)