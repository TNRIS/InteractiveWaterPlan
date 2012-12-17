define([
    'views/BaseTableCollectionView'
    'views/StrategyView'
    'collections/StrategyCollection'
    'scripts/text!templates/strategyTable.html'
],
(BaseTableCollectionView, StrategyView, StrategyCollection, tpl) ->

    class StrategyCollectionView extends BaseTableCollectionView
        
        initialize: () ->
            super StrategyView, StrategyCollection, tpl
            return null
)