###
    Class: OpenLayers.Layer.Vector
    Vector-based layer that reads its features from a JSON service.
  
    Inherits from:
       - <OpenLayers.Layer.XYZ>

    #TODO: Basically, take in aan array of JS objects that have a 
    # wktGeogField attribute, parse that attribute into a feature
    # and make a Vector Layer out of those features.  Pretty easy.
###
###
OpenLayers.Layer.JsonVector = OpenLayers.Class(OpenLayers.Layer.Vector, {


    wktGeogField: "wktGeog"


    CLASS_NAME: "OpenLayers.Layer.JsonVector"
})
###