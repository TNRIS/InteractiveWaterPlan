define([
    'namespace'
    'views/BaseStrategyView'
    'scripts/text!templates/entityStrategyRow.html'
],
(namespace, BaseStrategyView, tpl) ->

    class EntityStrategyView extends BaseStrategyView

        template: tpl

)