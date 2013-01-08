define([
], 
() ->

    class RegionCollection extends Backbone.Collection
        url: "#{BASE_API_PATH}api/boundary/regions/names"   
)