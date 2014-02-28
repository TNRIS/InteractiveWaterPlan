
OpenLayers.Control.GetFeature = OpenLayers.Class(OpenLayers.Control, {
    
    #The service url to make the query to
    #The service at this endpoint should expect the following request params:
    #double lat
    #double lon
    #int zoom
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
        this.events.triggerEvent("beforegetfeature", {xy: evt.xy})
        
        #add the cursor wait class
        OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");
        this.request(evt.xy);
        return null

    request: (clickPosition) ->

        serviceOptions = this.buildServiceOptions(this.serviceUrl, clickPosition)
        request = OpenLayers.Request.GET(serviceOptions)

        return null


    buildServiceOptions: (url, clickPosition) ->
        geogLonLat = this.map.getLonLatFromPixel(clickPosition).transform(
            this.map.projection, this.map.displayProjection)

        params = OpenLayers.Util.extend({
            lon: geogLonLat.lon
            lat: geogLonLat.lat
            zoom: this.map.getZoom()

        })

        return {
            url: url
            params: params
            scope: this
            callback: (request) ->
                this.handleResponse(clickPosition, request, url)
                return null
        }


    handleResponse: (xy, request, url) ->
        if request.responseText == ""
            OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait")
            this.events.triggerEvent("nofeaturefound")

        else
            features = this.format.read(request.responseText)

            if not features?
                OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait")
                this.events.triggerEvent("nofeaturefound")

            else
                features = [features] if  features not instanceof Array
                this.triggerGetFeature(request, xy, features)
        
        return null

    triggerGetFeature: (request, xy, features) ->
        this.events.triggerEvent("getfeature", {
            text: request.responseText
            request: request
            xy: xy
            features: features
        })
        #Reset the cursor.
        OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait")
        return null

    CLASS_NAME: "OpenLayers.Control.GetFeature"
})