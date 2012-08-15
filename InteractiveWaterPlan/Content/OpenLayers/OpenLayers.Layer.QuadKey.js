

/**
 * @requires OpenLayers/Layer/XYZ.js
 */

/** 
 * Class: OpenLayers.Layer.QuadKey
 * Layer using direct tile access based on Bing-style Quad Keys
 * 
 * Inherits from:
 *  - <OpenLayers.Layer.XYZ>
 */
OpenLayers.Layer.QuadKey = OpenLayers.Class(OpenLayers.Layer.XYZ, {
 
    /**
     * Constructor: OpenLayers.Layer.QuadKey
     *
     * Parameters:
     * name - {String}
     * url - {String} Must include ${quadkey} in the URL
     * options - {Object} Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, url, options) {
        if (options && options.sphericalMercator || this.sphericalMercator) {
            options = OpenLayers.Util.extend({
                projection: "EPSG:900913",
                numZoomLevels: 19
            }, options);
        }
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, [
            name || this.name, url || this.url, {}, options
        ]);
    },

    /**
     * Method: getURL
     * Generates a Bing-style quad key based on the current XYZ of the tiles and returns 
     * the url with that quad key
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     */
    getURL: function(bounds) {
        var xyz = this.getXYZ(bounds), x = xyz.x, y = xyz.y, z = xyz.z;
        var quadDigits = [];
        for (var i = z; i > 0; --i) {
            var digit = '0';
            var mask = 1 << (i - 1);
            if ((x & mask) != 0) {
                digit++;
            }
            if ((y & mask) != 0) {
                digit++;
                digit++;
            }
            quadDigits.push(digit);
        }
        var quadKey = quadDigits.join("");
        var url = this.url

        return OpenLayers.String.format(url, {'quadkey': quadKey});
    },

    
    
    CLASS_NAME: "OpenLayers.Layer.QuadKey"
});
