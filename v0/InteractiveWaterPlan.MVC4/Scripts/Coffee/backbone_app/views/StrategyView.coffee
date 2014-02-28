define([
    'namespace'
    'views/BaseStrategyView'
    'scripts/text!templates/strategyRow.html'
],
(namespace, BaseStrategyView, tpl) ->

    class StrategyView extends BaseStrategyView

        template: tpl

)