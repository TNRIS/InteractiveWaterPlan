define([
], 
() ->

    class CountyNetSupplyCollection extends Backbone.Collection
        url: "#{BASE_API_PATH}api/strategies/county-net"   
)