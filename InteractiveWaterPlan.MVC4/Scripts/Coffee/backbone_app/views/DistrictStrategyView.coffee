define([
    'namespace'
    'views/BaseStrategyView'
    'scripts/text!templates/districtStrategyRow.html'
],
(namespace, BaseStrategyView, tpl) ->

    class DistrictStrategyView extends BaseStrategyView

        template: tpl

)