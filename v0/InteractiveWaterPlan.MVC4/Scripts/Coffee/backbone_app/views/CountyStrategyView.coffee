define([
    'namespace'
    'views/BaseStrategyView'
    'scripts/text!templates/countyStrategyRow.html'
],
(namespace, BaseStrategyView, tpl) ->

    class CountyStrategyView extends BaseStrategyView

        template: tpl

)