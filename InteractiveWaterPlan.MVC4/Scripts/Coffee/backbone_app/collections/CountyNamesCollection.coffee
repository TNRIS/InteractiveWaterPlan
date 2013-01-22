define([
], 
() ->

    class CountyNamesCollection extends Backbone.Collection
        url: "#{BASE_API_PATH}api/boundary/counties/names"   
)