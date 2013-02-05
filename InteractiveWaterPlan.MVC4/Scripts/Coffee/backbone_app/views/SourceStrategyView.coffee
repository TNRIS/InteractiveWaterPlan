define([
    'namespace'
    'views/BaseStrategyView'
    'scripts/text!templates/sourceStrategyRow.html'
],
(namespace, BaseStrategyView, tpl) ->

    class SourceStrategyView extends BaseStrategyView

        template: tpl

)