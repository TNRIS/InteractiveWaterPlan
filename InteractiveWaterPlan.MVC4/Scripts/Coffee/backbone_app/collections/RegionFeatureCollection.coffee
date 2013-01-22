define([
]
() ->
    
    class RegionFeatureCollection extends Backbone.Collection
        url: "#{BASE_API_PATH}api/boundary/regions/all"
)