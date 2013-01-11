define([
    'views/BaseTableCollectionView'
    'views/CountyNetSupplyView'
    'collections/CountyNetSupplyCollection'
    'scripts/text!templates/countyNetSupplyTable.html'
],
(BaseTableCollectionView, CountyNetSupplyView, CountyNetSupplyCollection, tpl) ->

    class CountyNetSupplyCollectionView extends BaseTableCollectionView

        initialize: (options) ->
            _.bindAll(this)

            super CountyNetSupplyView, 
                CountyNetSupplyCollection, tpl
           
        fetchCallback: () ->
            #TODO: Maybe tell the MapView to turn on the Regions Layer
            return null
)