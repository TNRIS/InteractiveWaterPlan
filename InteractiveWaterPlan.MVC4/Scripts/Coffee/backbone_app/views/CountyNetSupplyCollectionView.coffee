define([
    'namespace'
    'views/BaseSelectableRegionTableView'
    'views/CountyNetSupplyView'
    'collections/CountyNetSupplyCollection'
    'scripts/text!templates/countyNetSupplyTable.html'
],
(namespace, BaseSelectableRegionTableView, CountyNetSupplyView, 
    CountyNetSupplyCollection, tpl) ->

    class CountyNetSupplyCollectionView extends BaseSelectableRegionTableView

        initialize: (options) ->

            super CountyNetSupplyView, CountyNetSupplyCollection, 
                tpl, options.mapView
           
            return

)