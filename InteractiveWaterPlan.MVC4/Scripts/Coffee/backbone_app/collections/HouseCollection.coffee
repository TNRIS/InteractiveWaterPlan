define([
], 
() ->

    class HouseCollection extends Backbone.Collection
        url: "#{BASE_API_PATH}api/boundary/districts/house/names"   
)