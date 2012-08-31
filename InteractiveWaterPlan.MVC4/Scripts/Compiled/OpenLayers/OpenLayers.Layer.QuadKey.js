// Generated by CoffeeScript 1.3.3
/*
    Class: OpenLayers.Layer.QuadKey
    Layer using direct tile access based on Bing-style Quad Keys
  
    Inherits from:
       - <OpenLayers.Layer.XYZ>
*/

OpenLayers.Layer.QuadKey = OpenLayers.Class(OpenLayers.Layer.XYZ, {
  serverResolutions: [156543.03390625, 78271.516953125, 39135.7584765625, 19567.87923828125, 9783.939619140625, 4891.9698095703125, 2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.29858214169740677, 0.14929107084870338, 0.07464553542435169],
  initialize: function(name, url, options) {
    if (options && options.sphericalMercator || this.sphericalMercator) {
      options = OpenLayers.Util.extend({
        projection: "EPSG:900913",
        numZoomLevels: 19
      }, options);
    }
    OpenLayers.Layer.Grid.prototype.initialize.apply(this, [name || this.name, url || this.url, {}, options]);
    return null;
  },
  getURL: function(bounds) {
    var quadDigits, quadKey, url, x, xyz, y, z, _ref;
    xyz = this.getXYZ(bounds);
    _ref = [xyz.x, xyz.y, xyz.z], x = _ref[0], y = _ref[1], z = _ref[2];
    quadDigits = [];
    
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
        ;

    quadKey = quadDigits.join("");
    url = this.url;
    return OpenLayers.String.format(url, {
      'quadkey': quadKey
    });
  },
  CLASS_NAME: "OpenLayers.Layer.QuadKey"
});