define([

],
() ->
    class PlaceFeature extends Backbone.Model
        #Has fields id, wktGeog, and name

        url: "#{BASE_API_PATH}api/place/feature/hull" # must specify placeId parameter during fetch
)