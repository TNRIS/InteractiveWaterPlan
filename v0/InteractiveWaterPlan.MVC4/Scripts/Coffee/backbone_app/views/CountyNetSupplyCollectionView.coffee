define([
    'namespace'
    'views/BaseSelectableRegionStrategyView'
    'views/CountyNetSupplyView'
    'collections/CountyNetSupplyCollection'
    'scripts/text!templates/countyNetSupplyTable.html'
],
(namespace, BaseSelectableRegionStrategyView, CountyNetSupplyView, 
    CountyNetSupplyCollection, tpl) ->

    class CountyNetSupplyCollectionView extends BaseSelectableRegionStrategyView

        initialize: (options) ->

            super CountyNetSupplyView, CountyNetSupplyCollection, 
                tpl, namespace.mapView
           
            return

)