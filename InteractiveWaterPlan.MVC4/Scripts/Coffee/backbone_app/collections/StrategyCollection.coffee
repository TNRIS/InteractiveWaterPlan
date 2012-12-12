define([
    'models/Strategy'
], 
(Strategy) ->

    class StrategyCollection extends Backbone.Collection
        model: Strategy    
        url: "#{BASE_API_PATH}api/strategy/all"
        
)