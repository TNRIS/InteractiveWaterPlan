/* Configuration parameters for iswpApp */
/* global ISWP_VARS */
angular.module('iswpApp.config', [])
  .constant('BING_API_KEY', 'Ar54FaSONDkvSeqhwoBnBW61JYlThqD8XVtwlaRAcUZDfKQzDjo2kjkMLKT3LCVi')
  .constant('SWP_WMS_URL', 'http://services.tnris.org/ags/services/swp/swp/MapServer/WMSServer')
  .constant('TILES_URL', 'http://tile{s}.texasstatewaterplan.org/tiles')
  .constant('STATE_MAP_CONFIG', {
    zoom: 5,
    centerLat: 31.780548,
    centerLng: -99.022907
  })
  .constant('DEMANDS_ENTITY_STYLE', {
    color: '#fff',
    weight: 1,
    opacity: 0.5,
    fillOpacity: 0.75,
    fillColor: '#444'
  })
  .constant('NEEDS_ENTITY_STYLE', {
    color: '#000',
    weight: 1,
    opacity: 0.5,
    fillOpacity: 0.75
  })
  .constant('ISWP_VARS', ISWP_VARS) //boostrapped variables
  .constant('API_PATH', '/api/v1/')
;
