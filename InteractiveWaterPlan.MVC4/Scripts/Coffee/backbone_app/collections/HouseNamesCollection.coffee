define([
], 
() ->

    class HouseNamesCollection extends Backbone.Collection
        url: "#{BASE_PATH}api/boundary/districts/house/names"   
)