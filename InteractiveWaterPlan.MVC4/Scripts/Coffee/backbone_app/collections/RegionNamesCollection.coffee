define([
], 
() ->

    class RegionNamesCollection extends Backbone.Collection
        url: "#{BASE_PATH}api/boundary/regions/names"   
        
        model: Backbone.Model.extend(
            idAttribute: 'letter')
)