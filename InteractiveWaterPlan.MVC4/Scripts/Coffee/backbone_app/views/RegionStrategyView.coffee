define([
    'namespace'
    'views/BaseStrategyView'
    'scripts/text!templates/regionStrategyRow.html'
],
(namespace, BaseStrategyView, tpl) ->

    class RegionStrategyView extends BaseStrategyView

        template: tpl

)