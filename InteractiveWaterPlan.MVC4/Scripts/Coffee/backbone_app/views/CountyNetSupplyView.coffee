define([
    'namespace'
    'views/BaseStrategyView'
    'scripts/text!templates/countyNetSupplyRow.html'
],
(namespace, BaseStrategyView, tpl) ->

    class CountyNetSupplyView extends BaseStrategyView

        template: tpl

)