define([
], 
() ->

    class SenateCollection extends Backbone.Collection
        url: "#{BASE_API_PATH}api/boundary/districts/senate/names"   
)