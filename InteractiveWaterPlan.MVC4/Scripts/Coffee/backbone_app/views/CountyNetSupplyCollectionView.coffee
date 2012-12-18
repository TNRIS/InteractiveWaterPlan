define([
    'views/BaseTableCollectionView'
    'views/CountyNetSupplyView'
    'collections/CountyNetSupplyCollection'
    'scripts/text!templates/countyNetSupplyTable.html'
],
(BaseTableCollectionView, CountyNetSupplyView, CountyNetSupplyCollection, tpl) ->

    class CountyNetSupplyCollectionView extends BaseTableCollectionView

        initialize: (options) ->
            _.bindAll(this, 'selectCounty', 'selectRegion')

            super options.currYear, CountyNetSupplyView, CountyNetSupplyCollection, tpl
           
            #create KO observable properties for the selecting county and region
            @selectedCounty = ko.observable()
            @selectedRegion = ko.observable()

            return null

        selectCounty: (data, event) ->
            $target = $(event.target)

            #set the observable to the selected county id and name
            countyId = $target.attr('data-value')
            countyName = $target.attr('data-name')
            @selectedCounty({
                countyId: countyId
                countyName: countyName
            })

            return null

        selectRegion: (data, event) ->
            $target = $(event.target)

            #set the observable to the selected region id and name
            regionId = $target.attr('data-value')
            regionName = $target.attr('data-name')
            @selectedRegion({
                regionId: regionId
                regionName: regionName
            })
            
            return null
)