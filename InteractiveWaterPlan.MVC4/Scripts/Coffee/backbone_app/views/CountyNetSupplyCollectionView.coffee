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

            super options.currYear, CountyNetSupplyView, 
                CountyNetSupplyCollection, tpl
           
            #create KO observable properties for the selecting county and region
            @selectedCounty = ko.observable()
            @selectedRegion = ko.observable()

            return null

        selectCounty: (data, event) ->
            $target = $(event.target)

            #set the observable to the selected county id and name
            countyId = $target.data('value')
            countyName = $target.data('name')
            @selectedCounty({
                id: countyId
                name: countyName
            })

            return null

        selectRegion: (data, event) ->
            $target = $(event.target)

            #set the observable to the selected region id and name
            regionLetter = $target.data('value')
            
            @selectedRegion({
                id: regionLetter
                name: regionLetter
            })
            
            return null
)