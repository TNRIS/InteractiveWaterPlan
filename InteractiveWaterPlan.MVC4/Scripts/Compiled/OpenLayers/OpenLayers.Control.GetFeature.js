// Generated by CoffeeScript 1.6.2
OpenLayers.Control.GetFeature = OpenLayers.Class(OpenLayers.Control, {
  serviceUrl: null,
  layers: null,
  handler: null,
  maxFeatures: 1,
  format: null,
  initialize: function(options) {
    OpenLayers.Control.prototype.initialize.apply(this, [options]);
    this.handler = new OpenLayers.Handler.Click(this, {
      "click": this.getInfoForClick
    });
    if (!this.format) {
      this.format = new OpenLayers.Format.JSON();
    }
    return null;
  },
  getInfoForClick: function(evt) {
    this.events.triggerEvent("beforegetfeature", {
      xy: evt.xy
    });
    OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");
    this.request(evt.xy);
    return null;
  },
  request: function(clickPosition) {
    var request, serviceOptions;

    serviceOptions = this.buildServiceOptions(this.serviceUrl, clickPosition);
    request = OpenLayers.Request.GET(serviceOptions);
    return null;
  },
  buildServiceOptions: function(url, clickPosition) {
    var geogLonLat, params;

    geogLonLat = this.map.getLonLatFromPixel(clickPosition).transform(this.map.projection, this.map.displayProjection);
    params = OpenLayers.Util.extend({
      lon: geogLonLat.lon,
      lat: geogLonLat.lat,
      zoom: this.map.getZoom()
    });
    return {
      url: url,
      params: params,
      scope: this,
      callback: function(request) {
        this.handleResponse(clickPosition, request, url);
        return null;
      }
    };
  },
  handleResponse: function(xy, request, url) {
    var features;

    if (request.responseText === "") {
      OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
      this.events.triggerEvent("nofeaturefound");
    } else {
      features = this.format.read(request.responseText);
      if (features == null) {
        OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
        this.events.triggerEvent("nofeaturefound");
      } else {
        if (!(features instanceof Array)) {
          features = [features];
        }
        this.triggerGetFeature(request, xy, features);
      }
    }
    return null;
  },
  triggerGetFeature: function(request, xy, features) {
    this.events.triggerEvent("getfeature", {
      text: request.responseText,
      request: request,
      xy: xy,
      features: features
    });
    OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
    return null;
  },
  CLASS_NAME: "OpenLayers.Control.GetFeature"
});
