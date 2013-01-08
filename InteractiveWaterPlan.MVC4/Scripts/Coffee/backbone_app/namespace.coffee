define([
    #Could put jquery, underscore, backbone, openlayers, etc in here
    # and include this file in all define statements.
    'collections/WugFeatureCollection'
],
(WugFeatureCollection) ->
    namespace = {}

    #Shared collections (or whatever else) go in here.

    namespace.wugFeatureCollection = new WugFeatureCollection()

    return namespace
)