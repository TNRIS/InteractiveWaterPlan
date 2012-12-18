define([
    'views/BaseTableCollectionView'
    'views/CountyNetSupplyView'
    'collections/CountyNetSupplyCollection'
    'scripts/text!templates/countyNetSupplyTable.html'
],
(BaseTableCollectionView, CountyNetSupplyView, CountyNetSupplyCollection, tpl) ->

    class CountyNetSupplyCollectionView extends BaseTableCollectionView

        initialize: (options) ->

            super options.startingYear, CountyNetSupplyView, CountyNetSupplyCollection, tpl
           
            return null
)