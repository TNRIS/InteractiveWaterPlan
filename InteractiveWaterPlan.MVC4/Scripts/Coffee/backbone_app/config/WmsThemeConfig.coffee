﻿define([
],
() ->
    WmsThemeConfig =
        Layers: [
            {
                name: "Regional Water Planning Areas"
                type: "WMS"
                url: "http://services.tnris.org/arcgis/services/swp/swp/MapServer/WMSServer"
                service_params:
                    layers: "4"
                    transparent: true
                layer_params:
                    isBaseLayer: false
                    visibility: false
                    opacity: 0.6
            }
            {
                name: "Water System Service Areas"
                type: "WMS"
                url: "http://services.tnris.org/arcgis/services/swp/SWP_Boundaries/MapServer/WMSServer"
                service_params:
                    layers: "0"
                    transparent: true
                layer_params:
                    isBaseLayer: false
                    visibility: false
                    opacity: 0.6
            }
            {
                name: "Texas Counties"
                type: "WMS"
                url: "http://services.tnris.org/arcgis/services/swp/swp/MapServer/WMSServer"
                service_params:
                    layers: "1"
                    transparent: true
                layer_params:
                    isBaseLayer: false
                    visibility: false
                    opacity: 0.6
            }
            {
                name: "Texas Senate Districts (2011)"
                type: "WMS"
                url: "http://services.tnris.org/arcgis/services/swp/swp/MapServer/WMSServer"
                service_params:
                    layers: "3"
                    transparent: true
                layer_params:
                    isBaseLayer: false
                    visibility: false
                    opacity: 0.6
            }
            {
                name: "Texas House Districts (2011)"
                type: "WMS"
                url: "http://services.tnris.org/arcgis/services/swp/swp/MapServer/WMSServer"
                service_params:
                    layers: "2"
                    transparent: true
                layer_params:
                    isBaseLayer: false
                    visibility: false
                    opacity: 0.6
            }
           
        ]

    return WmsThemeConfig
)