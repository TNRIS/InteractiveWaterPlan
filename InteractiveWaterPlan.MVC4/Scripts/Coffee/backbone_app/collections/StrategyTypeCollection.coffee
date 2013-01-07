define([
], 
() ->
    class StrategyTypeCollection extends Backbone.Collection
        url: "#{BASE_API_PATH}api/strategy/types"   
)