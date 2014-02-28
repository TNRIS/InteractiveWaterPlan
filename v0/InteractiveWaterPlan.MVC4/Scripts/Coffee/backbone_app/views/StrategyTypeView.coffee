define([
    'namespace'
    'views/BaseStrategyView'
    'scripts/text!templates/strategyTypeRow.html'
],
(namespace, BaseStrategyView, tpl) ->

    class StrategyTypeView extends BaseStrategyView

        template: tpl

)