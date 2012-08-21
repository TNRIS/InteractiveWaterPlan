
OpenLayers.Control.GetFeatureInfo = OpenLayers.Class(OpenLayers.Control, {
    
    #The service url to make the query to
    #The service at this endpoint should expect the following request params:
    #  layers
    #  srs
    #  bbox
    #  height
    #  width
    #  x
    #  y
    serviceUrl: null
    
    #The list of layers to for which the request should be made
    layers: null    

    handler: null

    maxFeatures: 1

    format: null

    initialize: (options) ->

        OpenLayers.Control.prototype.initialize.apply(this, [options])

        this.handler = new OpenLayers.Handler.Click(
            this, {"click": this.getInfoForClick}
        )

        #TODO: Maybe define our own OpenLayers.Format here
        if not this.format
            this.format = new OpenLayers.Format.JSON()
            

        return null

    getInfoForClick: (evt) ->
        this.events.triggerEvent("beforegetfeatureinfo", {xy: evt.xy})
        
        #add the cursor wait class
        OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");
        this.request(evt.xy);
        return null

    request: (clickPosition) ->
        layers = this.findLayers()

        if layers.length is 0
            this.events.triggerEvent("nogetfeatureinfo");
            # Reset the cursor.
            OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
            return null


        serviceOptions = this.buildServiceOptions(this.serviceUrl, layers, clickPosition)
        request = OpenLayers.Request.GET(serviceOptions)

        return null


    buildServiceOptions: (url, layers, clickPosition) ->
        layerNames = []
        for lyr in layers
            layerNames = layerNames.concat(lyr.params.LAYERS)


        firstLayer = layers[0]
        # use the firstLayer's projection if it matches the map projection -
        # this assumes that all layers will be available in this projection
        projection = this.map.getProjection();
        layerProj = firstLayer.projection;
        if layerProj and layerProj.equals(this.map.getProjectionObject())
            projection = layerProj.getCode();


        params = OpenLayers.Util.extend({
            layers: layerNames
            bbox: this.map.getExtent().toBBOX(
                null, firstLayer.reverseAxisOrder())
            height: this.map.getSize().h
            width: this.map.getSize().w
            feature_count: this.maxFeatures
            srs: projection
            x: parseInt(clickPosition.x)
            y: parseInt(clickPosition.y)
        })

        return {
            url: url
            params: OpenLayers.Util.upperCaseObject(params)
            scope: this
            callback: (request) ->
                this.handleResponse(clickPosition, request, url)
                return null
        }


    handleResponse: (xy, request, url) ->
        features = this.format.read(request.responseText)
        
        if features["Error"]
            OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait")
            this.events.triggerEvent("nofeaturefound")

        else
            this.triggerGetFeatureInfo(request, xy, features)
        
        return null

    triggerGetFeatureInfo: (request, xy, features) ->
        this.events.triggerEvent("getfeatureinfo", {
            text: request.responseText
            request: request
            xy: xy
            features: features
        })
        #Reset the cursor.
        OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait")
        return null

    findLayers: () ->
        candidates = this.layers
        layers = []
        for lyr in candidates
            if lyr instanceof OpenLayers.Layer.WMS
                layers.push(lyr)

        return layers

    CLASS_NAME: "OpenLayers.Control.GetFeatureInfo"
})