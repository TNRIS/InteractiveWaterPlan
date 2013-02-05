define([
], 
() ->

    class SenateNamesCollection extends Backbone.Collection
        url: "#{BASE_PATH}api/boundary/districts/senate/names"   
)