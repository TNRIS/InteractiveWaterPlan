define([
], 
() ->

    class SenateNamesCollection extends Backbone.Collection
        url: "#{BASE_API_PATH}api/boundary/districts/senate/names"   
)