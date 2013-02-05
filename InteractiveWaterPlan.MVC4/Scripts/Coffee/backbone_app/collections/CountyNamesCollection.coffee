define([
], 
() ->

    class CountyNamesCollection extends Backbone.Collection
        url: "#{BASE_PATH}api/boundary/counties/names"   
)