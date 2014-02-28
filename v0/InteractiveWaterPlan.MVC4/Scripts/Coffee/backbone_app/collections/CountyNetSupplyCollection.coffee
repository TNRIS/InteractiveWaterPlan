define([
], 
() ->

    class CountyNetSupplyCollection extends Backbone.Collection
        url: "#{BASE_PATH}api/supply/county-net"   
)