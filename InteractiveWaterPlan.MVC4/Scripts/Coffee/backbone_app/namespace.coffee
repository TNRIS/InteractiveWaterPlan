define([
    #Could put jquery, underscore, backbone, openlayers, etc in here
    # and include this file in all define statements.
    'collections/WugFeatureCollection'
],
(WugFeatureCollection) ->
    namespace = {}

    #Shared collections (or whatever else) go in here.

    namespace.wugFeatureCollection = new WugFeatureCollection()

    namespace.VALID_YEARS = ["2010", "2020", "2030", "2040", "2050", "2060"]
    namespace.currYear = "2010" #default year to start on

    return namespace
)