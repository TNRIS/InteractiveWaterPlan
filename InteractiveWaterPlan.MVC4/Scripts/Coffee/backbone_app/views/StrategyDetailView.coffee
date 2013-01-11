define([
    'namespace'
    'views/BaseStrategyView'
    'scripts/text!templates/strategyDetailRow.html'
],
(namespace, BaseStrategyView, tpl) ->

    class StrategyDetailView extends BaseStrategyView

        template: tpl

)