define [], () ->
    WmsThemeConfig = {
        #Colors for styling Source features
        SourceStyles: [
            { #This default one should always be first
                id: "default"
                name: "DEFAULT"
                strokeColor: "blue"
                fillColor: "blue"
                strokeWidth: 1
            }
            {
                id: 0
                name: "SURFACE WATER"
                default:
                    strokeColor: "white"
                    fillColor: "#1E90FF"
                    strokeWidth: 1
                LineString:
                    strokeWidth: 2
                    strokeColor: "#1E90FF"
                MultiLineString:
                    strokeWidth: 2
                    strokeColor: "#1E90FF"
            }
            {
                id: 1
                name: "GROUNDWATER"
                default:
                    strokeColor: "white"
                    fillColor: "#4682B4"
                    strokeWidth: 1
                LineString:
                    strokeWidth: 2
                    strokeColor: "#4682B4"
                MultiLineString:
                    strokeWidth: 2
                    strokeColor: "#4682B4"
            }
            #0 - SURFACE WATER
            #1 - GROUNDWATER
            #3 - CONSERVATION
            #4 - REUSE
            #5 - DROUGHT MANAGEMENT
            #6 - WEATHER MODIFICATION
        ]

        Layers: [
            {
                name: "Regional Water Planning Areas"
                type: "WMS"
                url: "http://services.tnris.org/ags/services/swp/swp/MapServer/WMSServer"
                viewType: "Regions"
                service_params:
                    layers: "4,7"
                    transparent: true
                layer_params:
                    isBaseLayer: false
                    visibility: true
                    opacity: 0.6
            }
            {
                name: "Texas Counties"
                type: "WMS"
                url: "http://services.tnris.org/ags/services/swp/swp/MapServer/WMSServer"
                viewType: "Counties"
                service_params:
                    layers: "1,9"
                    transparent: true
                layer_params:
                    isBaseLayer: false
                    visibility: false
                    opacity: 0.6
            }
            {
                name: "Texas County Names"
                type: "WMS"
                url: "http://services.tnris.org/ags/services/swp/swp/MapServer/WMSServer"
                viewType: "CountyNames"
                service_params:
                    layers: "9"
                    transparent: true
                layer_params:
                    isBaseLayer: false
                    visibility: false
                    opacity: 0.6
            }
            {
                name: "Texas Senate Districts (2011)"
                type: "WMS"
                url: "http://services.tnris.org/ags/services/swp/swp/MapServer/WMSServer"
                viewType: "SenateDistricts"
                service_params:
                    layers: "3,13"
                    transparent: true
                layer_params:
                    isBaseLayer: false
                    visibility: false
                    opacity: 0.6
            }
            {
                name: "Texas House Districts (2011)"
                type: "WMS"
                url: "http://services.tnris.org/ags/services/swp/swp/MapServer/WMSServer"
                viewType: "HouseDistricts"
                service_params:
                    layers: "2,11"
                    transparent: true
                layer_params:
                    isBaseLayer: false
                    visibility: false
                    opacity: 0.6
            }
            #{
            #    name: "Water System Service Areas"
            #    type: "WMS"
            #    url: "http://services.tnris.org/ags/services/swp/SWP_Boundaries/MapServer/WMSServer"
            #    service_params:
            #        layers: "0"
            #        transparent: true
            #    layer_params:
            #        isBaseLayer: false
            #        visibility: false
            #        opacity: 0.6
            #}
           
        ]

    }

    return WmsThemeConfig