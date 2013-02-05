define([
], 
() ->
    class StrategyTypeCollection extends Backbone.Collection
        url: "#{BASE_PATH}api/strategy/types"   
)