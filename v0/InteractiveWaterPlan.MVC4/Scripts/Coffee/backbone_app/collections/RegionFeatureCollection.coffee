define([
]
() ->
    
    class RegionFeatureCollection extends Backbone.Collection
        url: "#{BASE_PATH}api/boundary/regions/all"
)