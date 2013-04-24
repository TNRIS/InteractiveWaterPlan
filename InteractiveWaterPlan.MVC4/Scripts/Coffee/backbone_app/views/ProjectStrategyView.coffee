define([
    'namespace'
    'views/BaseStrategyView'
    'scripts/text!templates/projectStrategyRow.html'
],
(namespace, BaseStrategyView, tpl) ->

    class ProjectStrategyView extends BaseStrategyView

        template: tpl

)